import { Question } from "../models/Question.js";
import { sendNotification } from "./notificationController.js";

 
export const createQuestion = async (req, res) => {
  try {
    const { title, description, tags, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const question = new Question({
      title,
      description,
      tags,
      user: userId, // save as ObjectId ref
    });

    await question.save();

    res.status(201).json(question);
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ error: "Failed to post question" });
  }
};




export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      {
        $lookup: {
          from: "answers", // collection name for Answer model
          localField: "_id",
          foreignField: "questionId",
          as: "answers"
        }
      },
      {
        $lookup: {
          from: "users", // collection name for User model
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          tags: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            email: "$user.email"
          },
          answerCount: { $size: "$answers" }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};



export const voteQuestion = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; 
  const voterId = req.user?.id || req.user?.uid;
  try {
    const question = await Question.findById(id);
    question.votes += type === "up" ? 1 : -1;
    await question.save();

    
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Voting failed" });
  }
};

//get question by id
export const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
};
 
export const increaseLike = async (req, res) => {
  const { id } = req.body;       // id is question id
  try {
    const question = await Question.findById(id).populate('user'); // Ensure populated
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.votes += 1;
    await question.save();

   await sendNotification({
      recipientId: question.user._id,
      senderId: req.user.id,
      referenceId: question._id,
      type: "like",
      message: `${req.user.username || 'Someone'} liked your question: "${question.title}"`
    });

    res.status(200).json({ message: "Like increased" });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
};


 
export const decreaseLike=async(req,res)=>{
  const {id}=req.body;
  try {
    const question = await Question.findById(id).populate('user');
       if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    question.votes-=1;
    await question.save();
    await sendNotification({
      recipientId: question.user._id,
      senderId: req.user.id,
      referenceId: question._id,
      type: "dislike",
      message: `${req.user.username || 'Someone'} unliked your question: "${question.title}"`
    })
    
    res.status(200).json({message:"Like decreased"});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
}
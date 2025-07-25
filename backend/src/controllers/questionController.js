import { Question } from "../models/Question.js";

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
    const questions = await Question.find()
      .populate({
        path: "user",      // 🔑 this matches the `user` field in your Question schema
        select: "email",   // ✅ only get the `email` field from User
      })
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};


export const voteQuestion = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // up or down
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

export const increaseLike=async(req,res)=>{
  const {id}=req.body;
  try {
    const question = await Question.findById(id);
    question.votes+=1;
    await question.save();
    res.status(200).json({message:"Like increased"});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
}

export const decreaseLike=async(req,res)=>{
  const {id}=req.body;
  try {
    const question = await Question.findById(id);
    question.votes-=1;
    await question.save();
    res.status(200).json({message:"Like decreased"});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
}
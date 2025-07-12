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
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
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

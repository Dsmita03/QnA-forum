
import {Answer} from "../models/Answer.js";
import {Question} from "../models/Question.js";
export const addAnswer = async (req, res) => {
  const { content, questionId } = req.body;
  try {
    const answer = await Answer.create({ content, questionId, userId: req.user.uid });
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ error: "Failed to post answer" });
  }
};

export const voteAnswer = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  try {
    const answer = await Answer.findById(id);
    answer.votes += type === "up" ? 1 : -1;
    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: "Voting failed" });
  }
};

export const acceptAnswer = async (req, res) => {
  const { answerId, questionId } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (question.userId !== req.user.uid) return res.status(403).json({ error: "Unauthorized" });

    question.acceptedAnswerId = answerId;
    await question.save();
    res.json({ message: "Answer accepted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept answer" });
  }
};

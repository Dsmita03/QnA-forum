import Comment from "../models/Comment";

export const addComment = async (req, res) => {
  const { answerId, content } = req.body;
  try {
    const comment = await Comment.create({ answerId, content, userId: req.user.uid });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to post comment" });
  }
};

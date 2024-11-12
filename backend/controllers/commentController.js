import Comment from "../models/commentModel.js";
import constants from "../utils/constants.js";

//Add new comment
export const addComment = async (req, res) => {
  const { question } = req.body;
  const newComment = new Comment({
    question,
  });
  try {
    const savedComment = await newComment.save();
    if (savedComment)
      res
        .status(constants.CREATED)
        .json({ message: "Commentaire sauvegardé", comment: savedComment });
  } catch (err) {
    res.status(constants.SERVER_ERROR).json(err);
  }
};

//Get all comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res
      .status(constants.SUCCESS)
      .json({ message: "Tous les commentaires", comments });
  } catch (err) {
    res.status(constants.SERVER_ERROR).json(err);
  }
};

//Delete comment
export const deleteComment = async (req, res) => {
  const { idComment } = req.body;
  try {
    await Comment.findByIdAndDelete(idComment);
    res.status(constants.SUCCESS).json({ message: "Commentaire supprimé" });
  } catch (err) {
    res.status(constants.SERVER_ERROR).json(err);
  }
};

//Update comment
export const updateComment = async (req, res) => {
  const { idComment, question } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(idComment, {
      question,
    });
    if (updatedComment)
      res
        .status(constants.SUCCESS)
        .json({ message: "Commentaire mis à jour", comment: updatedComment });
  } catch (err) {
    res.status(constants.SERVER_ERROR).json(err);
  }
};

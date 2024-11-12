import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    transform: (doc, ret) => {
      ret.idComment = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  }
);

export default mongoose.model("Comment", commentSchema);

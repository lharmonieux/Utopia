import mongoose from "mongoose";
import unique_validator from "mongoose-unique-validator";

const actSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  chapter: {
    type: Number,
    required: true,
    unique: true,
  },
  questions: [
    {
      content: {
        type: String,
        required: true,
        unique: true,
      },
      order: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      answer_type: {
        type: String,
        required: true,
      },
      thematic: {
        type: String,
        required: true,
      },
      answers: [
        {
          content: String,
          score: Number,
          feedback: String,
        },
      ],
    },
  ],
});

actSchema.plugin(unique_validator, {
  message: "{VALUE} existe déjà.",
});

export default mongoose.model("Act", actSchema);

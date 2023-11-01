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
  description: {
    type: String
  },
  townStatus: {
    type: String,
    required: true
  },
  resolution: {
    type: String,
    required: true
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
      answerType: {
        type: String,
        required: true,
      },
      answers: [
        {
          content: String,
          score: Number,
          feedback: String,
          thematic: String,
          givenResidents: Number
        },
      ],
    },
  ],
});

actSchema.plugin(unique_validator, {
  message: "{VALUE} existe déjà.",
});

export default mongoose.model("Act", actSchema);

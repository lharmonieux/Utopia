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
    text: String,
    titleImg: String,
    rankImg: String
  },
  visual: {
    backgroundImg: String,
    etiquetteImg: String,
    titleImg: String
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
      visual: {
        etiquetteImg: String,
        answerImg: String,
        enumAnswer: Boolean,
        directionAnswer: String,
        shift: Number
      },
      buttonImg: String,
      answerType: {
        type: String,
        required: true,
      },
      answers: [
        {
          content: String,
          score: Number,
          feedback: {
            text: String,
            img: String
          },
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

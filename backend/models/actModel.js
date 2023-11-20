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
    rankImg: String,
    backgroundImg: String,
  },
  visual: {
    backgroundImg: String,
    decorationImg: String,
    titleImg: String,
    logoAppImg : String
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
        backgroundImg: String,
        answerImg: String,
        enumAnswer: Boolean,
        directionAnswer: String,
        margin: Number,
        shift: Number,
        mapView: {
          mapImg: String,
          buttonImg: [
            {
              button: String,
              buttonGif : String,
              labelImg: String
            }
          ]
        }
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
            titleImg : String,
            backgroundImg: String
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

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
    type: String,
  },
  townStatus: {
    type: String,
    required: true,
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
    logoAppImg: String,
  },
  questions: [
    {
      content: [
        {
          text: String,
          backgroundImg: String,
          justifyContent: String,
          textColor: String,
        },
      ],
      order: {
        type: Number,
        required: true,
      },
      additionalContent: {
        text: String,
        img: String,
        scale: {
          width: String,
          height: String,
        },
        position: {
          top: String,
          left: String,
        },
      },
      visual: {
        bgImgMainContent: String,
        boxAnswersImg: {
          img: String,
          width: String,
          height: String,
          left: String,
          top: String
        },
        directionAnswer: String,
        mapView: {
          backgroundImg: String,
          mapImg: String,
          buttonImg: {
            button: String,
            buttonGif: String,
          },
          descriptionImg: String,
          hasAnswers: Boolean,
        },
        feedbackImg: String,
      },
      answerType: {
        type: String,
        required: true,
      },
      answers: [
        {
          content: {
            text: {
              text: String,
              position: {
                top: String,
                left: String,
                width: String,
                height: String
              },
            },
            textColor: String,
            position: {
              top: String,
              left: String,
            },
          },
          img: String,
          choiceImg: {
            align: String,
            img: String,
          },
          score: Number,
          feedback: String,
          thematic: String,
          givenResidents: Number,
        },
      ],
    },
  ],
});

actSchema.plugin(unique_validator, {
  message: "{VALUE} existe déjà.",
});

export default mongoose.model("Act", actSchema);

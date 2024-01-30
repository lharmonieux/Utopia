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
    textStyle: {
      color: String,
      size: String,
      weight: String,
    },
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
          marginLeft: Number,
          backgroundImg: {
            img: String,
            width: Number,
            height: Number,
            left: Number,
            top: Number,
          },
          justifyContent: String,
          textColor: String,
          textArea: {
            width: Number,
            height: Number,
            img: String
          },
          answerType: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "AnswerType",
          },
        },
      ],
      order: {
        type: Number,
        required: true,
      },
      additionalContent: [
        {
          text: String,
          textLevel: String,
          textColor: String,
          img: String,
          scale: {
            width: Number,
            height: Number,
          },
          position: {
            top: Number,
            left: Number,
          },
        },
      ],
      visual: {
        bgImgMainContent: String,
        boxAnswersImg: {
          img: String,
          width: Number,
          height: Number,
          left: Number,
          top: Number,
        },
        directionAnswer: String,
        mapView: {
          marginTop: Number,
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
        textAnswerLevel: String,
        spaceAnswer: String,
        nbOfAnswersRequired: Number,
      },
      answers: [
        {
          content: {
            text: {
              text: String,
              secondText: String,
              hiddenText: Boolean,
              textLevel: String,
              position: {
                marginLeft: Number,
                marginTop: Number
              },
            },
            textColor: String,
            img: {
              name: String,
              top: Number,
              left: Number,
              width: Number,
              height: Number,
            },
          },
          choiceImg: {
            align: String,
            img: {
              name: String,
              top: Number,
              left: Number,
              width: Number,
              height: Number,
            },
          },
          score: Number,
          boolForScore: Boolean,
          feedback: String,
          feedbackHasQuestion: Boolean,
          thematic: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Thematic",
          },
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

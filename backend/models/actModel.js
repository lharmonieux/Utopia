import mongoose from "mongoose";
import unique_validator from "mongoose-unique-validator";

const actSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    townStatus: {
      type: String,
      required: true,
    },
    ending: {
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
    backgroundSong: String,
    questions: [
      {
        text: {
          content: String,
          marginLeft: Number,
          marginTop: Number,
          justifyContent: String,
          textColor: String,
          level: String
        },
        textArea: {
          width: Number,
          height: Number,
          img: String,
        },
        backgroundImg: {
          img: String,
          width: Number,
          height: Number,
          left: Number,
          top: Number,
        },
        questionType: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "QuestionType",
        },
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
            zIndex: Number,
          },
        ],
        bgImgMainContent: String,
        directionAnswer: String,
        nbOfAnswersRequired: Number,

        thematic: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Thematic",
        },
        visual: {
          textAnswerLevel: String,
          spaceAnswer: String,
        },
        answers: [
          {
            text: {
              content: String,
              textLevel: String,
              position: {
                marginLeft: Number,
                marginTop: Number,
              },
              textColor: String,
              hidden: Boolean,
              textBGColor: String,
            },
            bgImg: {
              name: String,
              top: Number,
              left: Number,
              width: Number,
              height: Number,
            },
            alternatifText: {
              content: String,
              textColor: String,
              hidden: Boolean,
              img: String,
            },
            selectionImg: {
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
            feedback: {
              text: String,
              img: String,
            },
            thematic: {
              type: mongoose.SchemaTypes.ObjectId,
              ref: "Thematic",
            },
            feedbackHasQuestion: Boolean,
            givenResidents: Number,
          },
        ],
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    transform: function (doc, ret) {
      ret.actId = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.isDeleted;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    },
  }
);

actSchema.plugin(unique_validator, {
  message: "{VALUE} existe déjà.",
});

export default mongoose.model("Act", actSchema);

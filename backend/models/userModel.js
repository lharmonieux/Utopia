import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    role: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Role",
      required: true,
    },
    character: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
    },
    secondCharacter: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
    },
    motto: String,
    town: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Town",
    },
    townName: String,
    partyName: String,
    symbol: String,
    currentAct: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Act",
    },
    comments: [
      {
        question: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Comment",
        },
        answer: String,
      },
    ],
    saves: [
      {
        act: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Act",
        },
        totalResidentsGot: Number,
        totalResidentsPossible: Number,
        logAnswers: [
          {
            question: String,
            thematic: { type: mongoose.SchemaTypes.ObjectId, ref: "Thematic" },
            scoreMaxPossible: Number,
            nbResidentsMaxPossible: Number,
            answers: [
              {
                content: String,
                score: Number,
                nbResidents: Number,
              },
            ],
          },
        ],
        logScores: [
          {
            thematic: { type: mongoose.SchemaTypes.ObjectId, ref: "Thematic" },
            scoreGot: Number,
            scoreMaxPossible: Number,
          },
        ],
      },
    ],
    project: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Project",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.userId = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.isDeleted;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", userSchema);

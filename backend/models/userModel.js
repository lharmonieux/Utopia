import mongoose from "mongoose";
import unique_validator from "mongoose-unique-validator";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  save: {
    logScores: [
      {
        thematic: String,
        totalScore: Number,
      },
    ],
    logAnswers: [
      {
        question: String,
        answer: String,
      },
    ],
    currentAct: String,   //Voir si possible de rendre une clé étrangère variable
    currentQuestion: String,
    motto: String,
    town: String,
    townStatus: String,
    character: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
    },
    secondCharacter: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
    }
  },
});

userSchema.plugin(unique_validator, {
  message: "{VALUE} est déjà utilisé.",
});

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import unique_validator from "mongoose-unique-validator";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  sauvegarde: {
    thematics: [
      {
        thematic: String,
        totalScore: Number,
      },
    ],
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    devise: String,
    ville: String,
    statutVille: String,
    character: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
    },
    act: String,
    currentQuestion: String,
  },
});

userSchema.plugin(unique_validator, {
  message: "{VALUE} est déjà utilisé.",
});

export default mongoose.model("User", userSchema);

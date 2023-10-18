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
  rule: {
    type: String,
    required: true,
  },
  sauvegarde: {
    thematic: [
      {
        name: String,
        total_score: Number,
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
    character: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
    },
    act: String,
    current_question: String,
  },
});

userSchema.plugin(unique_validator, {
  message: "{VALUE} est déjà utilisé.",
});

export default mongoose.model("User", userSchema);

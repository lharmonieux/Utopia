import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  character: Object,
  secondCharacter: Object,
  currentAct: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Act",
  },
  motto: String,
  town: {
    region: String,
    description: String,
  },
  townName: String,
  townStatus: String,
  saves: [
    {
      logScores: Object,
      logAnswers: [
        {
          question: String,
          answers: [{ content: String }],
        },
      ],
      totalResidents: Number,
      act: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Act",
      }, //Voir si possible de rendre une clé étrangère variable
    },
  ],
});

export default mongoose.model("User", userSchema);

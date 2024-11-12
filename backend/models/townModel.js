import mongoose from "mongoose";

const townSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  descriptionImg: String,
  labelImg: String,
  score: Number,
  givenResidents: Number,
  top: String,
  left: String,
  feedback: {
    text: String,
    img: String,
  },
});

export default mongoose.model("Town", townSchema);

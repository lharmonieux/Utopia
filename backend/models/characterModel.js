import mongoose from "mongoose";
import unique_validator from "mongoose-unique-validator";

const characterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    caracteristic: {
      type: String,
      required: true,
    },
    thematic: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Thematic",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    vignette: {
      type: String,
    },
  },
  {
    timestamps: true,
    transform: function (doc, ret) {
      ret.characterId = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.isDeleted;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    },
  }
);

characterSchema.plugin(unique_validator, {
  message: "{VALUE} existe déjà.",
});

export default mongoose.model("Character", characterSchema);

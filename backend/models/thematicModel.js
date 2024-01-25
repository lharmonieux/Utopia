import mongoose from "mongoose";

const thematicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

export default mongoose.model("Thematic", thematicSchema);
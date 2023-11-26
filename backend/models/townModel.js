import mongoose from "mongoose";

const townSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    labelImg: String,
    top: String,
    left: String,
    feedback: String
})

export default mongoose.model('Town', townSchema);
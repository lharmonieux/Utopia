import mongoose from "mongoose";

const answerTypeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.model('AnswerType', answerTypeSchema);
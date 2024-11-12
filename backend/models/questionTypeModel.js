import mongoose from "mongoose";

const questionTypeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.model('QuestionType', questionTypeSchema);
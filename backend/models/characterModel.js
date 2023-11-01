import mongoose from "mongoose";
import unique_validator from "mongoose-unique-validator";

const characterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    caracteristic: {
        type: String,
        required: true
    },
    thematic : {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

characterSchema.plugin(unique_validator, {
    message: '{VALUE} existe déjà.'
});

export default mongoose.model('Character', characterSchema);
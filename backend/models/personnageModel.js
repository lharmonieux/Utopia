import mongoose from "mongoose";
import unique_validator from "mongoose-unique-validator";

const characterSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true
    },
    caracteristique: {
        type: String,
        required: true
    }
});

characterSchema.plugin(unique_validator, {
    message: '{VALUE} existe déjà.'
});

export default mongoose.model('Character', characterSchema);
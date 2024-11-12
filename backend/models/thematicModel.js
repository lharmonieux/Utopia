import mongoose from "mongoose";

const thematicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    transform: (doc, ret) => {
        ret.thematicId = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    }
})

export default mongoose.model("Thematic", thematicSchema);
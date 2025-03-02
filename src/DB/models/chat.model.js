import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    messages: [
        {
            message: {
                type: String,
                required: true
            },
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
}, { timestamps: true })

const chatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default chatModel
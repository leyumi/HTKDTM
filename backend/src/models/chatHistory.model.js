const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    conversations: [
        {
            question: { type: String, required: true }, // Nội dung câu hỏi
            answer: { type: String, required: true },   // Nội dung câu trả lời
            timestamp: { type: Date, default: Date.now } // Thời gian
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
module.exports = ChatHistory;
'use strict'

const ChatHistory = require("../chatHistory.model");

const upsertChatHistory = async (userId, role, content) => {
    try {
        const chatHistory = await ChatHistory.findOneAndUpdate(
            { userId },
            {
                $push: { messages: { role, content } },
                $set: { updatedAt: Date.now() },
            },
            { upsert: true, new: true }
        );
        return chatHistory;
    } catch (error) {
        throw error;
    }
};

const saveChat = async (userId, question, answer) => {
    try {
        const chatHistory = await ChatHistory.findOne({ userId });

        if (!chatHistory) {
            // Tạo mới nếu người dùng chưa có lịch sử
            const newChatHistory = new ChatHistory({
                userId,
                conversations: [{ question, answer }]
            });
            await newChatHistory.save();
        } else {
            // Cập nhật lịch sử nếu đã tồn tại
            chatHistory.conversations.push({ question, answer });
            chatHistory.updatedAt = new Date();
            await chatHistory.save();
        }

        return true;
    } catch (error) {
        throw error;
    }
};

const getChatHistoryByUserId = async (userId) => {
    const chatHistory = await ChatHistory.findOne({ userId })
        .select('conversations')
        .exec();

    if (!chatHistory) {
        return null;
    }

    // Sắp xếp các phần tử trong conversations theo timestamp giảm dần
    chatHistory.conversations.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return chatHistory;
};

const deleteChatHistoryByUserId = async (userId) => {
    await ChatHistory.deleteOne({ userId });
};

module.exports = {
    saveChat,
    upsertChatHistory,
    getChatHistoryByUserId,
    deleteChatHistoryByUserId
};
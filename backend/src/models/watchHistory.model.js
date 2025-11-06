const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    document_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    watched_at: {
        type: Date,
        default: Date.now, // Thời gian người dùng xem video
    },
});

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);

module.exports = WatchHistory;
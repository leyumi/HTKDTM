const mongoose = require('mongoose');

const userLearningPathSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyMaterial',
        required: true,
    },
    is_watched: {
        type: Boolean,
        default: false,
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const UserLearningPath = mongoose.model('UserLearningPath', userLearningPathSchema);
module.exports = UserLearningPath;
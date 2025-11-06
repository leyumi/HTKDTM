'use strict'

const UserLearningPath = require("../learning_path.model");

const getWatchedVideos = async (userId) => {
    return await UserLearningPath.find({ user_id: userId, is_watched: true }).populate('video_id');
};

const getIncompleteVideos = async (userId) => {
    return await UserLearningPath.find({ user_id: userId, is_completed: false }).populate('video_id');
};


const startWatching = async (userId, videoId) => {
    const record = await UserLearningPath.findOne({ user_id: userId, video_id: videoId });

    if (!record) {
        await UserLearningPath.create({
            user_id: userId,
            video_id: videoId,
            is_watched: true,
            watched_at: new Date(),
        });
    }
};

const completeWatching = async (userId, videoId) => {
    await UserLearningPath.findOneAndUpdate(
        { user_id: userId, video_id: videoId },
        {
            is_completed: true,
            completed_at: new Date(),
            progress: 100,
        },
        { new: true }
    );
};


module.exports = {
    getWatchedVideos,
    getIncompleteVideos,
    startWatching,
    completeWatching
};
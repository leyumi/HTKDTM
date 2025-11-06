'use strict'

const StudyMaterial = require("../models/study_material.model");
const WatchHistory = require("../models/watchHistory.model");

const addWatchHistory = async (req, res) => {
    const { documentId } = req.body;

    const userId = req.user._id;

    try {
        // Kiểm tra xem lịch sử đã tồn tại hay chưa
        let history = await WatchHistory.findOne({
            user_id: userId,
            document_id: documentId,
        });

        if (history) {
            // Cập nhật thời gian xem mới nhất
            history.timestamp = Date.now();
            await history.save();

            return res.status(200).json({
                message: 'Watch history updated successfully',
                data: history,
            });
        }

        // Tạo lịch sử mới nếu chưa tồn tại
        history = await WatchHistory.create({
            user_id: userId,
            document_id: documentId,
        });

        return res.status(201).json({
            message: 'Watch history added successfully',
            data: history,
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error adding watch history: ${error.message}`,
        });
    }
};

const isDocumentWatched = async (req, res) => {
    const { documentId } = req.params;

    const userId = req.user._id;

    try {
        const history = await WatchHistory.findOne({
            user_id: userId,
            document_id: documentId,
        });

        return res.status(200).json({
            isWatched: !!history,
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error checking watch status: ${error.message}`,
        });
    }
};

const getUserCourseProgress = async (req, res) => {
    const userId = req.user._id;

    try {
        // Lấy lịch sử xem của người dùng và populate thông tin video
        const watchHistory = await WatchHistory.find({ user_id: userId })
            .populate('document_id', '_id title')
            .exec();

        if (!watchHistory.length) {
            return res.status(404).json({
                message: 'No watch history found for this user',
            });
        }

        // Tạo danh sách video IDs đã xem
        const watchedVideoIds = watchHistory.map(history => history.document_id._id.toString());

        // Lấy thông tin các khóa học liên quan đến video đã xem
        const studyMaterials = await StudyMaterial.find({
            list_video: { $in: watchedVideoIds },
        }).populate('list_video', '_id title');

        if (!studyMaterials.length) {
            return res.status(404).json({
                message: 'No courses found for watched videos',
            });
        }

        // Tính toán tiến độ cho từng khóa học
        const courseProgress = studyMaterials.map(course => {
            const totalVideos = course.list_video.length;
            const watchedVideos = course.list_video.filter(video =>
                watchedVideoIds.includes(video._id.toString())
            );

            return {
                courseId: course._id, // Thêm id của khóa học
                course: course.playlist_title,
                countVideoWatched: watchedVideos.length,
                progress: `${watchedVideos.length}/${totalVideos}`,
            };
        });

        return res.status(200).json({
            message: 'User course progress retrieved successfully',
            data: courseProgress,
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error retrieving course progress: ${error.message}`,
        });
    }
};


module.exports = {
    addWatchHistory,
    isDocumentWatched,
    getUserCourseProgress
}
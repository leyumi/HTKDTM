const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const StudyMaterial = require('../models/study_material.model');
const { findStudyMaterialsByKeyword, getAllStudyMaterialsPaging, findStudyMaterialsById } = require('../models/repositories/study_material.repo');
const { convertToObjectIdMongodb } = require('../utils');
const DocumentModel = require('../models/document.model');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const importDataFromCSV = async (req, res) => {
    try {
        const results = [];
        const filePath = path.resolve(__dirname, '../dbs/youtube_data1.csv');

        // Đọc dữ liệu từ CSV
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const data = {
                    title: row['title'],
                    url: row['url'],
                    playlist_title: row['playlist_title'],
                    embed_code: row['embed_code'],
                };
                results.push(data);
            })
            .on('end', async () => {
                try {
                    // Nhóm dữ liệu theo playlist_title
                    const groupedData = results.reduce((acc, item) => {
                        const { playlist_title, title, url, embed_code } = item;

                        if (!acc[playlist_title]) {
                            acc[playlist_title] = [];
                        }

                        acc[playlist_title].push({
                            title,
                            type: 'video',
                            url,
                            embed_code,
                        });

                        return acc;
                    }, {});

                    const studyMaterials = [];

                    // Xử lý từng playlist và tạo Document
                    for (const [playlist_title, videos] of Object.entries(groupedData)) {
                        const documentIds = [];

                        for (const videoData of videos) {
                            const document = new DocumentModel(videoData);
                            await document.save(); // Lưu vào collection Document
                            documentIds.push(document._id); // Lấy ObjectId của document
                        }

                        const studyMaterial = new StudyMaterial({
                            playlist_title,
                            list_video: documentIds,
                        });

                        await studyMaterial.save(); // Lưu StudyMaterial vào collection
                        studyMaterials.push(studyMaterial);
                    }

                    res.status(201).json({
                        message: 'Data imported successfully',
                        data: studyMaterials,
                    });
                } catch (err) {
                    console.error('Error during data import:', err.message);
                    res.status(500).json({
                        message: 'Error during data import',
                        error: err.message,
                    });
                }
            });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).json({
            message: 'Unexpected server error',
            error: err.message,
        });
    }
};

const findStudyMaterials = async (req, res) => {
    // example body 
    // {
    //     "keyword": ""
    // }
    const keyword = req.body.keyword;

    if (keyword === '') {
        return res.status(400).json({
            message: 'Keyword cannot be blank',
        });
    }

    try {
        const results = await findStudyMaterialsByKeyword(keyword);
        res.status(200).json({
            message: 'Search successful',
            data: results,
        });
    } catch (error) {
        res.status(500).json({
            // message: 'Error searching records',
            error: error.message,
        });
    }
};

const getAllStudyMaterials = async (req, res) => {
    const pageRq = parseInt(req.query.page, 0);
    const limitRq = parseInt(req.query.limit, 0);

    if (pageRq <= 0) {
        return res.status(400).json({
            message: 'page must be a positive number',
        });
    }

    if (limitRq <= 0) {
        return res.status(400).json({
            message: 'limit must be a positive number',
        });
    }

    const page = pageRq || 1;
    const limit = limitRq || 5;
    const skip = (page - 1) * limit;

    try {
        const results = await getAllStudyMaterialsPaging(skip, limit);

        res.status(200).json({
            message: 'Get study materials successful',
            data: results,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const getStudyMaterialsbyId = async(req, res) => {
    try {
        const playListId = convertToObjectIdMongodb(req.params.id);
        if(!playListId){
            return res.status(400).json({
                message: 'Id StudyMaterial not correct format',
            });
        }

        const results = await findStudyMaterialsById(playListId);

        if(!results){
            return res.status(404).json({
                message: 'StudyMaterial not found',
            });
        }

        res.status(200).json({
            message: 'Get StudyMaterial successful',
            data: results,
        });
    } catch (error) {
        res.status(500).json({
            // message: 'Error searching records',
            error: error.message,
        });
    }
}

module.exports = {
    importDataFromCSV,
    findStudyMaterials,
    getAllStudyMaterials,
    getStudyMaterialsbyId
};
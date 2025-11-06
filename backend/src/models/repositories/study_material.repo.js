'use strict'

const { unGetSelectData } = require("../../utils");
const StudyMaterial = require("../study_material.model");


const findStudyMaterialsByKeyword = async (keyword) => {
    try {
        const results = await StudyMaterial.find({
            // $text: { $search: keyword }
            $and: [
                // { title: { $regex: keyword, $options: 'i' } }, // Tìm kiếm không phân biệt hoa thường
                { playlist_title: { $regex: keyword, $options: 'i' } },
            ],
        })
        .populate('list_video', '_id title url embed_code')
        .sort('created_at')
        .select(unGetSelectData(['__v', 'type', 'created_at']));
        return results;
    } catch (error) {
        throw error;
    }
};

const getAllStudyMaterialsPaging = async (skip, limit) => {
    try {
        const results = await StudyMaterial.find()
        .populate('list_video', '_id title url embed_code')
        .sort({ created_at: 1 })
        .skip(skip)
        .limit(limit)
        .exec();
        return results;
    } catch (error) {
        throw error;
    }
};

const findStudyMaterialsById = async (playListId) => {
    try {
        const results = await StudyMaterial.findById(playListId).populate('list_video', '_id title url embed_code');
        if(!results){
            return null;
        }
        return results;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findStudyMaterialsByKeyword,
    getAllStudyMaterialsPaging,
    findStudyMaterialsById
}
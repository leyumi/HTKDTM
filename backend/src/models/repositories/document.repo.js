'use strict'

const DocumentModel = require("../document.model");

const findDocumentById = async (id) => {
    try {
        const result = await DocumentModel.findById(id);
        if(!result){
            return null;
        }
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findDocumentById,

}
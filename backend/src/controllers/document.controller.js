const { findDocumentById } = require("../models/repositories/document.repo");
const { convertToObjectIdMongodb } = require("../utils");


const getDocumentbyId = async (req, res) => {
    try {
        const documentId = convertToObjectIdMongodb(req.params.id);
        if(!documentId){
            return res.status(400).json({
                message: 'Id Document not correct format',
            });
        }

        const result = await findDocumentById(documentId);

        if(!result){
            return res.status(404).json({
                message: 'Document not found',
            });
        }

        res.status(200).json({
            message: 'Get document successful',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

module.exports = {
    getDocumentbyId
}
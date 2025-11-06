const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['pdf', 'video', 'link'],
        required: true,
        default: 'video'
    },
    url: {
        type: String,
        required: true,
    },
    embed_code: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

documentSchema.index({ title: 1 });

const DocumentModel = mongoose.model('Document', documentSchema);
module.exports = DocumentModel;

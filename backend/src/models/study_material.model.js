const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
    playlist_title: {
        type: String,
        required: true,
    },
    list_video: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
        }
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// studyMaterialSchema.index({ title: 'text', playlist_title: 'text' });
studyMaterialSchema.index({ playlist_title: 1 });

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);
module.exports = StudyMaterial;

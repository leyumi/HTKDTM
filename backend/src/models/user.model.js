const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['free_user', 'paid_user', 'admin'],
        default: 'free_user',
    },
    full_name: {
        type: String,
        required: false,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['M', 'FM'],
        required: false
    },
    date_of_birth: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: false,
    },
    major: {
        type: String,
        required: false,
    },
    class: {
        type: String,
        required: false,
    },
    gpa: {
        type: Number,
        min: 0,
        max: 4,
        required: false,
    },
    study_schedule: {
        type: Array,
        default: [],
    },
    list_mark: {
        type: Array,
        default: [],
    },
    isSynced: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

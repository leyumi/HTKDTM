const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    plan: {
        type: String,
        enum: ['month', 'year'],
        default: 'month',
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'failed'],
        default: 'pending',
    },
    transactionId: {
        type: String, // Mã giao dịch của bên thứ ba (nếu có)
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware cập nhật `updatedAt` mỗi khi tài liệu được chỉnh sửa
invoiceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
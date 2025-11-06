'use strict'

const Invoice = require("../invoice.model");


const createInvoice = async (userId, plan, amount, transactionId = null) => {
    try {
        const invoice = new Invoice({
            userId,
            plan,
            amount,
            transactionId,
        });

        const savedInvoice = await invoice.save();

        return savedInvoice;
    } catch (error) {
        throw new Error(`Error creating invoice: ${error.message}`);
    }
};

const getInvoicesByUserId = async (userId) => {
    try {
        const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 }).exec();
        return invoices;
    } catch (error) {
        throw new Error(`Error retrieving invoices: ${error.message}`);
    }
};


const updateInvoiceStatus = async (transactionId, status) => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { transactionId },
            { status, updatedAt: Date.now() },
            { new: true } // Trả về bản ghi đã cập nhật
        );

        if (!updatedInvoice) {
            return null;
        }

        return updatedInvoice;
    } catch (error) {
        throw new Error(`Error updating invoice status: ${error.message}`);
    }
};


const deleteInvoice = async (invoiceId) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);

        if (!deletedInvoice) {
            throw new Error('Invoice not found');
        }

        return deletedInvoice;
    } catch (error) {
        throw new Error(`Error deleting invoice: ${error.message}`);
    }
};


module.exports = {
    createInvoice,
    getInvoicesByUserId,
    updateInvoiceStatus,
    deleteInvoice
};
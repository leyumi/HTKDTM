'use strict'

require('dotenv').config();
const { createInvoice, getInvoicesByUserId, updateInvoiceStatus, deleteInvoice } = require("../models/repositories/invoice.repo");
const { createPaymentLink, handleWebHookPayOS } = require('../models/repositories/payos.repo');
const { convertToObjectIdMongodb } = require("../utils");


const createInvoiceAPI = async (req, res) => {
    const { plan } = req.body;
    const userId = convertToObjectIdMongodb(req.user._id);
    const cancelUrl = `${process.env.APP_URL}/setting`;
    const returnUrl = `${process.env.APP_URL}/setting`;
    const orcodeCode = Number(String(new Date().getTime()).slice(-10));
    const amount = (plan == "month") ? 30000 : 300000;
    const description = (plan == "month") ? "Thanh toan goi thang" : "Thanh toan goi nam";

    const body = {
        orderCode: orcodeCode,
        amount: amount,
        description: description,
        cancelUrl,
        returnUrl
    };

    try {
        const payment = await createPaymentLink(body);

        if(!payment){
            return res.status(503).json({
                message: 'Create payment error',
            });
        }

        const invoice = await createInvoice(userId, plan, amount, orcodeCode);
        res.status(200).json({
            message: 'Invoice created successfully',
            data: payment,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error creating invoice: ${error.message}`,
        });
    }
};


const getInvoicesByUserIdAPI = async (req, res) => {
    const { userId } = req.params;

    try {
        const invoices = await getInvoicesByUserId(userId);
        res.status(200).json({
            message: 'Invoices retrieved successfully',
            data: invoices,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error retrieving invoices: ${error.message}`,
        });
    }
};


const updateInvoiceStatusAPI = async (req, res) => {
    try {
        const dataHook = await handleWebHookPayOS(req.body);

        if(!dataHook){
            return res.status(400).json({
                message: 'Invoice status update failed',
            });
        }

        // console.log(dataHook);

        const updatedInvoice = await updateInvoiceStatus(dataHook.orderCode, 'paid');
        if (!updatedInvoice) {
            
            return res.status(200).json({ // <--- SỬA DÒNG NÀY THÀNH 200
                message: 'Invoice not found (Webhook Test OK)', // Bạn có thể đổi message này
            });
        }


        res.status(200).end();
        // res.status(200).json({
        //     message: 'Invoice status updated successfully',
        //     data: updatedInvoice,
        // });
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({
            message: `Error updating invoice status: ${error.message}`,
        });
    }
};


const deleteInvoiceAPI = async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const deletedInvoice = await deleteInvoice(invoiceId);
        res.status(200).json({
            message: 'Invoice deleted successfully',
            data: deletedInvoice,
        });
    } catch (error) {
        res.status(500).json({
            message: `Error deleting invoice: ${error.message}`,
        });
    }
};


module.exports = {
    createInvoiceAPI,
    getInvoicesByUserIdAPI,
    updateInvoiceStatusAPI,
    deleteInvoiceAPI
}
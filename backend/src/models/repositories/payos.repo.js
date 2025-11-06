'use strict'

const payOS = require("../../configs/payos.config");

const createPaymentLink = async (body) => {
    try {
        const paymentLinkRes = await payOS.createPaymentLink(body);

        const data = {
            bin: paymentLinkRes.bin,
            checkoutUrl: paymentLinkRes.checkoutUrl,
            accountNumber: paymentLinkRes.accountNumber,
            accountName: paymentLinkRes.accountName,
            amount: paymentLinkRes.amount,
            description: paymentLinkRes.description,
            orderCode: paymentLinkRes.orderCode,
            qrCode: paymentLinkRes.qrCode,
        }

        return data;

    } catch (error) {
        console.log(error);
        return null;
    }
};

const handleWebHookPayOS = async (body) => {
    try {
        const webhookData = payOS.verifyPaymentWebhookData(body);
        return webhookData;
    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = {
    createPaymentLink,
    handleWebHookPayOS
};
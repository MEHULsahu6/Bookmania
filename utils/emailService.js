const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOrderStatusEmail = async (userEmail, orderData) => {
    const statusMessages = {
        processing: 'Your order is being processed',
        shipped: 'Your order has been shipped',
        delivered: 'Your order has been delivered',
        cancelled: 'Your order has been cancelled'
    };

    const emailContent = `
        <h2>Order Status Update</h2>
        <p>Dear ${orderData.customerName},</p>
        <p>${statusMessages[orderData.status]}</p>
        <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
        ${orderData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>` : ''}
        <p>Thank you for shopping with Bookmania!</p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Order Status Update - ${orderData.orderNumber}`,
        html: emailContent
    };

    await transporter.sendMail(mailOptions);
};
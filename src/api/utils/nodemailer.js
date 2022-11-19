import nodemailer from '../../config/nodemailer.js';

const sendEmail = (mailOptions) => {
    nodemailer.smtpConnection.sendMail(mailOptions);
}

export default {
    sendEmail
};
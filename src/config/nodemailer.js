import nodemailer from 'nodemailer';
import { config } from "dotenv";
config();

const smtpConnection = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_SECRET
    }
});

export default {
    smtpConnection
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: "process.env.SMTP_USER",
        pass: "Ws7My2RbH58UOPhD"
    }
});
exports.default = transporter;

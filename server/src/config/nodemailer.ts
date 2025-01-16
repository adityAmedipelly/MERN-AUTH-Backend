import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: "process.env.SMTP_USER",
        pass: "Ws7My2RbH58UOPhD"

    }

})

export default transporter;
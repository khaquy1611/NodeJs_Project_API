import nodemailer from 'nodemailer';


const user = process.env.SECRET_USER;
const pass = process.env.SECRET_PASSWORD;


export const sendMail = async (from , to , subject , text , html) => { 
    let transporter  = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true ,
        auth: { 
            user,
            pass
        }
    });


    let info = await transporter.sendMail({ 
        from : from ,
        to: to,
        subject: subject,
        text: text,
        html: html
    });
}
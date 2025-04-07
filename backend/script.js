import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'preturi.alerta@gmail.com', 
        pass: 'twcj qmgg ourc ncdh' 
    }
});


const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'preturi.alerta@gmail.com',
        to: to, 
        subject: subject, 
        text: text 
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Eroare la trimiterea email-ului:', error);
        } else {
            console.log('Email trimis: ' + info.response);
        }
    });
};


sendEmail('negut.dianamihaela@gmail.com', 'Test Email', 'Acesta este un email de test trimis din Node.js!');

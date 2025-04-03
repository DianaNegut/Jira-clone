import nodemailer from 'nodemailer';

// Configurarea transportorului pentru Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'preturi.alerta@gmail.com', // Adresa ta de email
        pass: 'twcj qmgg ourc ncdh' // Parola ta de email (pentru aplicatii mai sigure, folosește un App Password dacă ai 2FA activat)
    }
});

// Funcția pentru trimiterea unui email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'preturi.alerta@gmail.com',
        to: to, // Adresa destinatarului
        subject: subject, // Subiectul email-ului
        text: text // Conținutul email-ului
    };

    // Trimiterea email-ului
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Eroare la trimiterea email-ului:', error);
        } else {
            console.log('Email trimis: ' + info.response);
        }
    });
};

// Exemplu de trimitere a unui email
sendEmail('negut.dianamihaela@gmail.com', 'Test Email', 'Acesta este un email de test trimis din Node.js!');

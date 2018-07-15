var nodemailer=require ('nodemailer');

require('../lib/env');
/**
 * mail helper to send mail 
 */
 console.log('process',process.env.STRIP_KEY);
exports.sendMail=(mailOptions,callBack)=>{
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'email-smtp.us-west-2.amazonaws.com',
        port: 2587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.AWS_MAIL_USER, 
            pass: process.env.AWS_MAIL_PASS
        }
    });

    // send mail with defined transport object
return transporter.sendMail(mailOptions,callBack);
}

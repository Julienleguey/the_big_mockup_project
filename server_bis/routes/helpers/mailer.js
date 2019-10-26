const nodemailer = require('nodemailer');

const emailService = process.env.EMAIL_SERVICE;
const email = process.env.EMAIL;
const password = process.env.MDP;


function receiptEmail(emailTo) {
  const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
      user: email,
      pass: password
    }
  });

  const mailOptions = {
    from: email,
    to: emailTo,
    subject: "Receipt for your purchase",
    html: "<p>This is another test in html</p>"
  }

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to: ", info.response);
    }
  })
}

// https://www.w3schools.com/nodejs/nodejs_email.asp
// https://nodemailer.com/about/

module.exports = {
  receiptEmail: receiptEmail,
}

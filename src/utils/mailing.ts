import nodemailer from "nodemailer";

// create a nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.USER_EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user:process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

export const userSignUp = async (to:string,username:string) => {
  const mailOptions = {
    from: `"Haprian Naturals" <${process.env.USER_EMAIL}>`,
    to: to,
    subject: "Email Verification",
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: 'Times New Roman', sans-serif;
            background-color: white;
            margin: 0;
            padding: 0;
        }
  
        .container {
            max-width: 600px;
            margin: auto;
            padding: 40px;
            border: 1px solid #eee;
            border-radius: 12px;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
  
        h1 {
            font-size: 32px;
            color: black;
            margin-bottom: 10px;
        }
  
        h2 {
            font-size: 24px;
            color: black;
            margin: 20px 0;
        }
  
        .code {
            background-color:rgb(255, 255, 255); /* Light gray for softer appearance */
            color: black;
            font-weight: bold;
            font-size: 28px;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            display: inline-block;
            border: 1px solid #ccc; /* Optional border for distinction */
        }
  
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
            margin: 10px 0;
        }
  
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
        }
  
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: black;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
  
        .btn:hover {
            background-color: #333; /* Slightly darker for hover effect */
        }
    </style>
  </head>
  <body>
    <div class="container">
        <h1>Welcome to HAPRIAN NATURALS</h1>
        <h2>Email Verification Required</h2>
        <p>Hi ${username},</p>
        <p>Thank you for signing up to HAPRIAN NATURALS, your premier destination for affordable, quality and 100% organic skincare and haircare products.</p>
        <p>Please use the following code to confirm your email address:</p>
        
  
        <div class="footer">
            <p>© 2025 HAPRIAN NATURALS. All Rights Reserved.</p>
        </div>
    </div>
  </body>
  </html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
    //   console.log("Verification email sent to:", to);
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw new Error("Could not send verification email");
  }
};

const express = require("express");
const mongoose= require("mongoose");
const cors=require("cors");
const nodemailer = require("nodemailer");
const CoderModel = require("./Models/Coders")
const app=express();




app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));



mongoose.connect("mongodb://127.0.0.1:27017/Coders");


app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if the email already exists
    CoderModel.findOne({ email: email })
      .then((existingUser) => {
        if (existingUser) {
          return res.json({ message: "User already registered with this email." });
        }
  
        // Create a new user if no duplicate is found
        CoderModel.create(req.body)
          .then((newUser) => res.json({ message: "User registered successfully.", user: newUser }))
          .catch((err) => res.json({ message: "Error creating user.", error: err }));
      })
      .catch((err) => res.json({ message: "Error checking for existing user.", error: err }));
  });

  

app.post("/login",(req,res)=>{
    const {email,password} = req.body;
    CoderModel.findOne({email:email})
    .then(user=>{
        if(user)
        {
            if(user.password===password)
            {
                res.json("Success");
            }
            else 
            {
                res.json("Worng Password")
            }
        }
        else 
        {
            res.json("No user Found, please register first");
        }
    })
})



function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
  });

        console.log(user)
        console.log(pass)
    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "CODE IDE PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Koding 101</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Koding 101 Inc</p>
      <p>1600 Amphitheatre Parkway</p>
      <p>California</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };
    transporter.sendEmail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}


app.post("/send_recovery_email", (req, res) => {
  console.log("Request received:", req.body); // Log incoming request
  const {recipient_email,OTP}=req.body
  sendEmail({recipient_email,OTP})
    .then((response) => {
      console.log("Email success response:", response);
      res.send(response.message);
    })
    .catch((error) => {
      console.error("Error in sending email:", error);
      res.status(500).send(error.message);
    });
});


app.post("/resetpassword", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Add `await` to the database query to ensure it resolves properly
    const user = await CoderModel.findOne({ email });
    
    if (!user) {
      // Remove extra dot in `res.status.(404)` and ensure proper chaining
      return res.status(404).json({ message: "User Not Found" });
    }

    // Update password
    user.password = newPassword;

    // Save updated user to the database
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error resetting password:", error);
    res.status(500).json({ message: "An error occurred while resetting the password" });
  }
});



app.listen(3001,()=>{
    console.log("server is running")
});





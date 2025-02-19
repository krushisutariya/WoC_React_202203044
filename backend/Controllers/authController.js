const CoderModel = require("../Models/Coders");
const UserFile = require("../Models/UserFile");
const axios = require("axios");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
//const { OAuth2Client } = require('google-auth-library');
const { google } = require("googleapis");

const defaultFileStructure = {
  name: "Root",
  isFolder: true,
  children: [
    {
      name: "defaultFile",
      isFolder: false,
      content: "console.log('hello, world')",
      language: "javascript",
    },
  ],
};




GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET

const OAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5173"
);

const googleLogin = async (req, res) => {
  const { code } = req.body;

  try {
    console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
    console.log("Authorization Code Received:", code);

    const googleResponse = await OAuth2Client.getToken(code);
    console.log("Google Token Response:", googleResponse);

    OAuth2Client.setCredentials(googleResponse.tokens);

    // Use axios instead of fetch
    const userResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
    );

    console.log("User Info:", userResponse.data);

    const { email, name, picture } = userResponse.data;

    let user = await CoderModel.findOne({ email });
    let token;

    if (user) {
      // If user exists, generate a JWT token
      token = jwt.sign(
        { username: name, email, password: name },
         "secret",
        { expiresIn: "12h" }
      );
    } else {
      // If user doesn't exist, create a new one
      user = await CoderModel.create({ username: name, email, password: name });

      const rootFolder = new UserFile({
        name: defaultFileStructure.name,
        isFolder: defaultFileStructure.isFolder,
        owner: user._id,
        parent: null,
      });

      await rootFolder.save();

      const defaultFile = new UserFile({
        name: defaultFileStructure.children[0].name,
        isFolder: defaultFileStructure.children[0].isFolder,
        content: defaultFileStructure.children[0].content,
        owner: user._id,
        parent: rootFolder._id,
        language: defaultFileStructure.children[0].language,
      });

      await defaultFile.save();

      rootFolder.children.push(defaultFile._id);
      await rootFolder.save();

      // Generate token after creating a new user
      token = jwt.sign(
        { username: name, email, password: name },
         "secret",
        { expiresIn: "12h" }
      );
    }

    return res.status(200).json({ email, name, image: picture, token });
  } catch (error) {
    console.error("Google Login Error:", error.message || error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "Unknown error",
    });
  }
};






const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if a user with this email already exists
    const existingUser = await CoderModel.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.json({ message: "User already registered with this email." });
    }

    // Create a new user
    const newUser = await CoderModel.create({ username, email, password });

    // Create the root folder for the user
    const rootFolder = new UserFile({
      name: defaultFileStructure.name,
      isFolder: defaultFileStructure.isFolder,
      owner: newUser._id,
      parent: null, 
    });

    await rootFolder.save();

    // Add the default file to the root folder
    const defaultFile = new UserFile({
      name: defaultFileStructure.children[0].name,
      isFolder: defaultFileStructure.children[0].isFolder,
      content: defaultFileStructure.children[0].content,
      owner: newUser._id,
      parent: rootFolder._id,
      language: defaultFileStructure.children[0].language, // Set the root folder as the parent
    });

    await defaultFile.save();

    // Add the default file's reference to the root folder's `children` array
    rootFolder.children.push(defaultFile._id);
    await rootFolder.save();

    res.json({
      message:
        "User registered successfully, and default file structure created.",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred.", error: err });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  CoderModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("Wrong Password");
      }
    } else {
      res.json("No user Found, please register first");
    }
  });
};

const sendEmail = ({ recipient_email, OTP }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mail_configs = {
      from: process.env.GMAIL_USER,
      to: recipient_email,
      subject: "CODE IDE PASSWORD RECOVERY",
      html: `<div style="font-family: Arial, sans-serif; min-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="padding: 20px; text-align: center; border-bottom: 2px solid #00466a;">
      <h1 style="margin: 0; font-size: 24px; color: #00466a; font-weight: bold;">CODE IDE</h1>
    </div>
    <div style="padding: 20px;">
      <p style="font-size: 16px; margin: 0 0 10px;">Hello</p>
      <p style="font-size: 14px; margin: 0 0 20px;">
        You have requested to reset your password. Please use the OTP below to complete the verification process. 
        If you did not request this, please ignore this email.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; background: #00466a; color: #fff; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px;">
         ${OTP}
        </span>
      </div>
      <p style="font-size: 14px; margin: 0 0 20px;">
        This OTP is valid for the next 10 minutes. Please do not share it with anyone.
      </p>
      <p style="font-size: 14px; margin: 0;">Regards,</p>
      <p style="font-size: 14px; font-weight: bold; margin: 5px 0;">The CODE IDE Team</p>
    </div>
    <div style="padding: 10px; text-align: center; font-size: 12px; color: #aaa; background: #f1f1f1;">
      <p style="margin: 5px 0;">CODE IDE</p>
      <p style="margin: 5px 0;">All rights reserved © 2025</p>
    </div>
  </div>
</div>`,
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        reject(new Error("Failed to send OTP email."));
      } else {
        resolve(info);
      }
    });
  });
};

const sendRecoveryEmail = (req, res) => {
  const { recipient_email, OTP } = req.body;

  if (!recipient_email || !OTP) {
    return res.status(400).json({ error: "Recipient email or OTP is missing" });
  }

  sendEmail({ recipient_email, OTP })
    .then(() => res.json({ message: "OTP sent successfully!" }))
    .catch((error) => res.status(500).json({ error: error.message }));
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await CoderModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while resetting the password" });
  }
};

const getUserIdByEmail = async (req, res) => {
  try {
    const { email } = req.query; // Get email from query parameters

    console.log(email);
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await CoderModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userId: user._id });
  } catch (error) {
    console.error("Error fetching user ID:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  sendRecoveryEmail,
  resetPassword,
  getUserIdByEmail,
  googleLogin,
};

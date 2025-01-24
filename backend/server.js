const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./Routes/authRoutes");
const fileRoutes = require("./Routes/fileRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); 
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/file", fileRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

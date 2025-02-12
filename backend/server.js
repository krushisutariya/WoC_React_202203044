const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const authRoutes = require("./Routes/authRoutes");
const fileRoutes = require("./Routes/fileRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); 
app.use(cors({
  origin: [
    "https://code-ide-frontend.onrender.com", 
    "http://localhost:5173"                   
  ],
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

app.use("", authRoutes);
app.use("", fileRoutes);

app.listen(process.env.PORT||3001, () => {
  console.log("Server is running on port 3001");
});

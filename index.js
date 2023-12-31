const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const stripeRoute = require("./routes/stripe");
const productsRoute = require("./routes/products");
const bodyParser = require('body-parser');
const users = require("./routes/users")
const orders = require("./routes/orders")


const nodemailer = require("nodemailer");

const app = express();
require("dotenv").config();

const port = `5000`;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

app.use(cors());


app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/stripe", stripeRoute);
app.use("/api/products", productsRoute);
app.use("/api/users", users);
app.use("/api/orders", orders);

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API...");
});

const uri = process.env.DB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iammanikandan.mannai@gmail.com',
    pass: 'bzra qhpy qqwm faqv'
  }
});

app.set('transporter', transporter);


app.post("/api/send-otp", async (req, res) => {
  const { toMail, otp } = req.body;

  try {
    const info = await transporter.sendMail({
      from: "iammanikandan.mannai@gmail.com",
      to: toMail,
      subject: "OTP for Login",
      text: `Your OTP for login is: ${otp}`,
    });

    console.log("Email sent successfully!", info.messageId);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending failed:", error.message);
    res.status(500).json({ error: "Email sending failed" });
  }
});

app.listen(5000, () => {
  console.log(`Server running on port: ${port}...`);
});

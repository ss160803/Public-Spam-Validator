// const express = require("express");
// const axios = require("axios");
// const dotenv = require("dotenv");
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to PublicSpamValidator!");
});

app.get("/validate-email", async (req, res) => {
  const email = req.query.email; // Get email from query parameter
  try {
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );
    const emailData = response.data;
    res.render("result", { emailData, spamData: null });
  } catch (error) {
    console.error("Error validating email:", error);
    res.status(500).send("Error validating email");
  }
});

app.get("/check-spam", async (req, res) => {
  console.log(process.env.OOPSPAM_API_KEY);
  const text = req.query.text; // Get text from query parameter
  try {
    const response = await axios.post("https://api.oopspam.com/v1", {
      text: text,
      api_key: process.env.OOPSPAM_API_KEY,
    },{
      headers: {
        'Content-Type': 'application/json',
        "X-Api-Key":process.env.OOPSPAM_API_KEY,
      }
    });
    const spamData = response.data;
    res.render("result", { emailData: null, spamData });
  } catch (error) {
    console.error("Error checking spam:", error.response ? error.response.data : error.message);
    res.status(500).send("Error checking spam");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

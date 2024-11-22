import express from "express";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";
import NodeCache from "node-cache";
import rateLimit from "express-rate-limit";
import axiosRetry from "axios-retry";
import axios from "axios";

dotenv.config();

const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Custom key generator for rate limiting based on user ID 
const customKeyGenerator = (req) => { 
  return req.cookies.userId || req.ip; // Fallback to IP if userId is not set
};

const emailvalidationLimiter = rateLimit({ 
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 2,// Limit each IP to 100 requests per windowMs
  keyGenerator:customKeyGenerator,
  message: "You reached your daily limit, please try after your cooling period expire."
});

const spamDetectionLimiter = rateLimit({ 
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1,// Limit each IP to 100 requests per windowMs
  keyGenerator:customKeyGenerator,
  message: "You reached your daily limit, please try after your cooling period expire."
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());

// Middleware to handle user tracking
app.use((req, res, next) => {
  let userId = req.cookies.userId;
  if (!userId) {
    userId = uuidv4();
    res.cookie('userId', userId, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 }); // 24 hours expiry
  }
  next();
});

axiosRetry(axios, {
  retries: 3,// Number of retry attempts 
  retryCondition: (error) => {
    return error.response.status === 429; // Retry only for rate limit errors
  },
  retryDelay: (retryCount) => {
    return axiosRetry.exponentialDelay(retryCount);// Exponential backoff delay 
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/validate-email", async (req, res, next) => {
  const email = req.query.email;
  const userId = req.cookies.userId;
  if (!email) {
    return res.status(400).send("Email is required.");
  }

  const cachedResponse = cache.get(`validate-email-${email}-${userId}`);
  if (cachedResponse) {
    console.log("Serving from cache");
    return res.render("result", { emailData: cachedResponse, spamData: null, cacheHit: true });
  }

  emailvalidationLimiter(req, res, next);
}, async(req, res) => {
  const email = req.query.email;
  const userId = req.cookies.userId;

  try {
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );

    const emailData = response.data;

    cache.set(`validate-email-${email}-${userId}`, emailData);

    res.render("result", { emailData, spamData: null, cacheHit: false });
  } catch (error) {
    console.error("Error validating email:", error);
    res.status(500).send("Error validating email. Please try again later.");
  }
});

app.get("/check-spam", async (req, res, next) => {
  const text = req.query.text;
  const userId = req.cookies.userId;

  if (!text) {
    return res.status(400).send("Text is required.");
  }

  const cachedResponse = cache.get(`check-spam-${text}-${userId}`);
  if (cachedResponse) {
    console.log("Serving from cache");
    return res.render("result", { emailData: null, spamData: cachedResponse, cacheHit: true });
  }

  spamDetectionLimiter(req, res, next);
}, async(req, res) => {
  const text = req.query.text;
  const userId = req.cookies.userId; // Use userId from cookies

  try {
    const requestData = {
      content: text,
      checkForLength: true,
      blockTempEmail: true,
      logIt: false,
      allowedLanguages: ["en"],
      allowedCountries: ["us"],
      blockedCountries: ["ru"],
      userId: userId // Use userId for tracking
    };

    const response = await axios.post("https://api.oopspam.com/v1/spamdetection", requestData, 
      {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.OOPSPAM_API_KEY,
      },
    });
    
    console.log("Spam Detection Request Data:", JSON.stringify(requestData, null, 2));
    console.log("Spam Detection Response:", JSON.stringify(response.data, null, 2));
    const spamData = response.data;
    // Log the complete response
    spamData.Details.isIPBlocked = spamData.Details.isIPBlocked || false; 
    spamData.Details.isEmailBlocked = spamData.Details.isEmailBlocked || false; 
    spamData.Details.isContentTooShort = spamData.Details.isContentTooShort || false;

    cache.set(`check-spam-${text}-${userId}`, spamData);

    res.render("result", { emailData: null, spamData, cacheHit: false });
  } catch (error) {
    console.error("Error checking spam:", error.response ? error.response.data : error.message);
    res.status(500).send("Error checking spam. Please try again later.");
  }
});

app.get("/privacy-policy", (req, res) => { 
  res.render("privacy-policy"); 
});

app.get("/contact-support", (req, res) => { 
  res.render("contact-support");
});

app.get("/about-us",(req,res)=>{
  res.render("about-us");
})
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

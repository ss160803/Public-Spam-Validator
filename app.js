import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import rateLimit from "express-rate-limit";
import axiosRetry from "axios-retry";

dotenv.config();

const app = express();
const port = 3000;
const cache = new NodeCache({stdTTL: 600, checkperiod:120})
const emailvalidationLimiter = rateLimit({ 
  windowMs: 24 * 60 * 60 * 1000, // 15 minutes 
  max: 2, // Limit each IP to 100 requests per windowMs 
  message: "You reached your daily limit, please try after your cooling period expire."
});

const spamDetectionLimiter = rateLimit({ 
  windowMs: 24 * 60 * 60 * 1000, // 15 minutes 
  max: 1, // Limit each IP to 100 requests per windowMs 
  message: "You reached your daily limit, please try after your cooling period expire."
});

app.set("view engine", "ejs");
app.use(express.static("public"));

axiosRetry(axios, { 
  retries: 3, // Number of retry attempts 
  retryCondition: (error) => { 
    return error.response.status === 429; // Retry only for rate limit errors 
    }, 
    retryDelay: (retryCount) => { 
      return axiosRetry.exponentialDelay(retryCount); 
    }// Exponential backoff delay 
});


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/validate-email", async (req, res,next) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send("Email is required.");
  }

  const cachedResponse = cache.get(`validate-email-${email}`); 
  if (cachedResponse) { 
    console.log("Serving from cache"); 
    return res.render("result", { emailData: cachedResponse, spamData: null, cacheHit: true });
  }
  
  emailvalidationLimiter(req,res, next);
}, async(req, res)=> {
  const email = req.query.email; 

  try {
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );
    const emailData = response.data;

    cache.set(`validate-email-${email}`, emailData);

    res.render("result", { emailData, spamData: null, cacheHit:false });
  } catch (error) {
    console.error("Error validating email:", error);
    res.status(500).send("Error validating email. Please try again later.");
  }
});

app.get("/check-spam", async (req, res, next ) => {
  const text = req.query.text;
  // const senderEmail = req.query.senderEmail || "testing@example.com"; 
  const senderIP = req.query.senderIP || "8.8.8.8";

  if (!text) {
    return res.status(400).send("Text is required.");
  }

  const cachedResponse = cache.get(`check-spam-${text}-${senderIP}`); 
  if (cachedResponse) { 
    console.log("Serving from cache"); 
    return res.render("result", { emailData: null, spamData: cachedResponse, cacheHit: true });
  }

  spamDetectionLimiter(req, res, next);
}, async(req, res)=>{
  const text = req.query.text;
  const senderIP = req.query.senderIP || "8.8.8.8";

  try {
    const requestData = {
      content: text,
      checkForLength: true,
      blockTempEmail: true,
      logIt: false,
      allowedLanguages: ["en"],
      allowedCountries: ["us"],
      blockedCountries: ["ru"],
      // email: senderEmail,
      senderIP: senderIP
    };

    const response = await axios.post("https://api.oopspam.com/v1/spamdetection",requestData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.OOPSPAM_API_KEY,
        },
      }
    );
    console.log("Spam Detection Request Data:", JSON.stringify(requestData, null, 2));
    console.log("Spam Detection Response:", JSON.stringify(response.data, null, 2));
    const spamData = response.data;
     // Log the complete response

    cache.set(`check-spam-${text}-${senderIP}`, spamData);

    res.render("result", { emailData: null, spamData, cacheHit: false });
  } catch (error) {
    console.error("Error checking spam:", error.response ? error.response.data : error.message);
    res.status(500).send("Error checking spam. Please try again later.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

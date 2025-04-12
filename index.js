require("dotenv").config();

const fs = require("fs").promises;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const moment = require("moment");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(bodyParser.json());

//middleware to serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

const MAIN_DB_URL =
  "https://vikoeif.edupage.org/rpr/server/maindbi.js?__func=mainDBIAccessor";

const CURRENT_URL =
  "https://vikoeif.edupage.org/timetable/server/currenttt.js?__func=curentttGetData";

app.post("/all", async (req, res) => {
  try {
    // Forward the request body to the external API
    const response = await axios.post(MAIN_DB_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Send the API response back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data from external API" });
  }
});

app.post("/current", async (req, res) => {
  try {
    // Forward the request body to the external API
    const response = await axios.post(CURRENT_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Send the API response back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data from external API" });
  }
});

let defaultImage = false;
function getOGImageURL(req, date) {
  if (defaultImage) {
    return `${req.protocol}://${req.get("host")}/default/default.png`;
  }
  return `${req.protocol}://${req.get("host")}/images/${date}.png`;
}

// Route to handle the preview_image request
app.get("/preview/:date", async (req, res) => {
  const { date } = req.params;

  const html = `
 <!DOCTYPE html>
    <html>
    <head>
      <meta property="og:title" content="Lecture Schedule for ${moment(date)
        .format("ddd MMM DD YYYY")
        .toString()}" />
      <meta property="og:description" content="VIKO EIF Timetable" />
      <meta property="og:image" content="${getOGImageURL(req, date)}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="https://viko-eif.imranhasan.dev/preview/${date.toString()}" />
      <meta property="og:type" content="article" />
      <title>VIKO EIF Timetable-${date.toString()}</title>
    </head>
    <body>
      <p>Redirecting...</p>
      <script>
        window.location.href = "https://viko-eif.imranhasan.dev/?date=${date}";
      </script>
    </body>
    </html>`;
  res.send(html);
});

function extractDate(url) {
  const parseURL = new URL(url);
  const date = parseURL.searchParams.get("date");
  return date;
}

const takeScreenshot = async (url) => {
  const response = await fetch(
    `https://api.screenshotone.com/take?access_key=${process.env.SCREENSHOT_ACCESS_KEY}&url=${url}&viewport_width=1200&viewport_height=630&delay=0&timeout=60&image_quality=80`
  );
  const imageBuffer = await response.arrayBuffer();

  await fs.writeFile(
    path.join(__dirname, "public/images", `${extractDate(url)}.png`),
    Buffer.from(imageBuffer)
  );
  console.log(`Screenshot saved as ${extractDate(url)}.png`);
};

app.get("/generate_og_image", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("URL is required");
  }
  const date = extractDate(url);

  const imagePath = path.join(__dirname, "public/images", `${date}.png`);

  try {
    // Check if image already exists
    await fs.access(imagePath);
    console.log("Serving from Existing");
    defaultImage = false;
    return res.json({ image: getOGImageURL(req, date) });
  } catch (err) {
    // File doesn't exist, proceed to generate it
    try {
      await takeScreenshot(url);
      defaultImage = false;
      return res.json({ image: getOGImageURL(req, date) });
    } catch (screenshotErr) {
      defaultImage = true;
      return res.json({ image: getOGImageURL(req, date) });
      console.error("Error capturing screenshot:", screenshotErr);
      return res.status(500).send("Error capturing screenshot");
    }
  }
});

app.get("/ice/delete-all", async (req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, "public/images"));

    //delete file asynchonously
    for (const file of files) {
      const filePath = path.join(__dirname, "public/images", file);
      await fs.unlink(filePath);
    }

    return res.json({ message: "All images deleted successfully" });
  } catch (err) {
    return res.status(500).send({ error: "Unable to read or delete files." });
  }
});

//webhook for messenger group bot
const PAGE_VERIFY_TOKEN = process.env.PAGE_VERIFY_TOKEN; //any string
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

//web hook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === PAGE_VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

//receiving messages
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const event = entry.messaging[0];
      const sender = event.sender.id;

      if (event.message && event.message.text) {
        const text = event.message.text.toLowerCase().trim();

        if (text === "#lecture today") {
          let response = " Today's Lectures:\n";
          response += "lectue 1,lecture2";
          sendMessage(sender, response);
        } else {
          sendMessage(sender, "Type '#lecture today' to see today's schedule");
        }
      }
    });
    res.sendStatus(200);
  }
});

function sendMessage(sender, text) {
  axios
    .post(
      `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        recipient: { id: sender },
        message: { text },
      }
    )
    .catch((err) => console.log("Error sending message:", err.response.data));
}

//privacy policy for messager bot review
app.get("/privacy-policy", (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy for PI24E Bot</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        h1 {
            color: #333;
        }
        p {
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <h1>Privacy Policy for PI24E Bot</h1>
    <p><strong>Effective Date:</strong> 12-04-2025</p>
    
    <h2>1. Introduction</h2>
    <p>Welcome to PI24E Bot (referred to as "we", "our", or "us"). This Privacy Policy explains how we handle information when you use our Facebook Messenger bot. We do not collect or store any personal data from users.</p>
    
    <h2>2. Information We Collect</h2>
    <p>We do not collect or store any personal data from users. Our bot only responds to queries related to the class schedule and does not retain any information once the conversation ends.</p>

    <h2>3. How We Use Your Information</h2>
    <p>Our bot responds to your queries about the class schedule. We do not use or share any personal data as no data is stored or collected. We use the messages you send to provide relevant responses about the class schedule for the day.</p>

    <h2>4. Data Retention</h2>
    <p>Since we do not store any data, there is no data retention period. Once a conversation ends, no information is retained.</p>

    <h2>5. Data Security</h2>
    <p>As we do not collect or store personal data, there are no security concerns related to user data.</p>

    <h2>6. Your Rights</h2>
    <p>As we do not store any personal data, there are no data access or deletion rights to request.</p>

    <h2>7. Purpose of the Bot</h2>
    <p>The purpose of this Facebook Messenger bot is to provide quick responses to class schedule queries. It does not initiate conversations or store any user data. Users can interact with the bot by typing specific commands (e.g., "#class schedule"), and the bot will reply with the relevant class schedule for the day.</p>

    <h2>8. No Use of Personal Data</h2>
    <p>Our bot does not collect, store, or share any personal information from users. It only processes the user’s message in real-time and provides a response based on predefined queries. No data is retained after the interaction ends.</p>

    <h2>9. Changes to This Privacy Policy</h2>
    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date".</p>

    <h2>10. Contact Information</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at: imranmdhasan07@gmail.com</p>
</body>
</html>
`;
  res.send(html);
});

app.get("/", (req, res) => {
  res.send("Welcome to VIKO EIF Lecture schedule app");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

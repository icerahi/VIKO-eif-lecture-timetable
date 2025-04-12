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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

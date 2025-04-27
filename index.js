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
function getOGImageURL(req, group, date) {
  if (defaultImage) {
    return `${req.protocol}://${req.get("host")}/default/default.png`;
  }
  return `${req.protocol}://${req.get("host")}/images/${group}_${date}.png`;
}

// Route to handle the preview_image request
app.get("/preview/:group/:date/", async (req, res) => {
  const { date, group } = req.params;

  const html = `
 <!DOCTYPE html>
    <html>
    <head>
      <meta property="og:title" content="Lecture Schedule for ${group} - ${moment(
    date
  )
    .format("ddd MMM DD YYYY")
    .toString()}" />
      <meta property="og:description" content="VIKO EIF Timetable" />
      <meta property="og:image" content="${getOGImageURL(req, group, date)}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="https://viko-eif.imranhasan.dev/preview/${group}/${date.toString()}" />
      <meta property="og:type" content="article" />
      <title>VIKO EIF ${group}-${date.toString()}</title>
    </head>
    <body>
      <p>Redirecting...</p>
      <script>
        window.location.href = "https://viko-eif.imranhasan.dev/?date=${date}&group=${group}";
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
function extractGroup(url) {
  const parseURL = new URL(url);
  const group = parseURL.searchParams.get("group");
  return group;
}

const takeScreenshot = async (url) => {
  const response = await fetch(
    `https://api.screenshotone.com/take?access_key=${process.env.SCREENSHOT_ACCESS_KEY}&url=${url}&viewport_width=1200&viewport_height=630&delay=0&timeout=60&image_quality=80`
  );
  const imageBuffer = await response.arrayBuffer();

  await fs.writeFile(
    path.join(
      __dirname,
      "public/images",
      `${extractGroup(url)}_${extractDate(url)}.png`
    ),
    Buffer.from(imageBuffer)
  );
  console.log(
    `Screenshot saved as ${extractGroup(url)}_${extractDate(url)}.png`
  );
};

app.get("/generate_og_image", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("URL is required");
  }
  const date = extractDate(url);
  const group = extractGroup(url);
  const imagePath = path.join(
    __dirname,
    "public/images",
    `${group}_${date}.png`
  );

  try {
    // Check if image already exists
    await fs.access(imagePath);
    console.log("Serving from Existing");
    defaultImage = false;
    return res.json({ image: getOGImageURL(req, group, date) });
  } catch (err) {
    // File doesn't exist, proceed to generate it
    try {
      await takeScreenshot(url);
      defaultImage = false;
      return res.json({ image: getOGImageURL(req, group, date) });
    } catch (screenshotErr) {
      defaultImage = true;
      return res.json({ image: getOGImageURL(req, group, date) });
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

// 🧾 JSONBin.io Credentials

const PWA_BIN_ID = process.env.PWA_BIN_ID;
const JSON_MASTERKEY = process.env.JSON_MASTERKEY;
const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b";

//pwa installation count and feedback

app.post("/count-pwa-user", async (req, res) => {
  try {
    const response = await axios.get(`${JSONBIN_BASE_URL}/${PWA_BIN_ID}`, {
      headers: { "X-Master-Key": JSON_MASTERKEY },
    });
    const currentCount = response.data.record.count || 0;
    const newCount = currentCount + 1;
    await axios.put(
      `${JSONBIN_BASE_URL}/${PWA_BIN_ID}`,
      { count: newCount },
      {
        headers: {
          "X-Master-Key": JSON_MASTERKEY,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ message: "Count updated", count: newCount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating count" });
  }
});

app.get("/total-pwa-users", async (req, res) => {
  try {
    const response = await axios.get(
      `${JSONBIN_BASE_URL}/${PWA_BIN_ID}/latest`,
      {
        headers: { "X-Master-Key": JSON_MASTERKEY },
      }
    );

    res.json({ count: response.data.record.count || 0 });
  } catch (err) {
    res.status(500).json({ error: "Error fetching count" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

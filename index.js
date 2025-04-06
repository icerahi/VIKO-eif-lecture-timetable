const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, "public")));

const MAIN_DB_URL =
  "https://vikoeif.edupage.org/rpr/server/maindbi.js?__func=mainDBIAccessor";

const CURRENT_URL =
  "https://vikoeif.edupage.org/timetable/server/currenttt.js?__func=curentttGetData";

function extractDate(url) {
  const parseURL = new URL(url);
  const date = parseURL.searchParams.get("date");
  return date;
}

//Helper function to capture the screenshot and save to a file
async function captureScreenshot(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    const date = extractDate(url);
    // Save screenshot to the 'public/images' folder with a unique name
    const screenshotPath = path.join(__dirname, "public/images", `${date}.png`);

    const element = await page.waitForSelector("#lectures", { timeout: 5000 });
    if (element) {
      await element.screenshot({ path: screenshotPath });
      await browser.close();
      return screenshotPath;
    }
    await page.screenshot({ path: screenshotPath });

    await browser.close();
    return screenshotPath;
  } catch (err) {
    console.error("Error during screenshot capture:", err);
    await browser.close();
    throw new Error("Error capturing screenshot");
  }
}

// Route to handle the preview_image request
app.get("/preview_image", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    // Capture the screenshot of the page at the URL and save it to the public/images directory
    const imagePath = await captureScreenshot(url);
    const date = extractDate(url);
    // Send the relative path of the saved image to the frontend
    const image = `${req.protocol}://${req.get("host")}/images/${date}.png`;
    res.json({ image });
  } catch (err) {
    console.error("Error capturing screenshot:", err);
    res.status(500).send("Error capturing screenshot");
  }
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

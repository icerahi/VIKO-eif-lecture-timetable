import puppeteer from "puppeteer";
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto("http://localhost:5173/?date=2025-04-09", {
  waitUntil: "networkidle2",
});
// await page.screenshot({
//   path: "hn.png",
// });
const fileElement = await page.waitForSelector('#lectures');
await fileElement.screenshot({
  path: 'div.png',
});
await browser.close();

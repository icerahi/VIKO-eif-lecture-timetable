import fs from "fs/promises";

const takeScreenshot = async (url) => {
  const response = await fetch(`https://api.screenshotone.com/take?
	access_key=APIKEY
	&url=${url}
	&viewport_width=1200
	&viewport_height=630
	&viewport_landscape=true
	&format=jpg
	&block_ads=true
	&block_cookie_banners=true
	&block_banners_by_heuristics=false
	&block_trackers=true
	&delay=0
	&timeout=60
	&response_type=by_format
	&image_quality=80`);

  const imageBuffer = await response.arrayBuffer();
  await fs.writeFile(`test.png`, Buffer.from(imageBuffer));
  console.log("Screenshot saved as screenshot.png");
};

takeScreenshot("https://viko-eif.imranhasan.dev/?date=2025-04-07");

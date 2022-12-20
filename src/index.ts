import fs from "fs";
import mustache from "mustache";
import playwright from "playwright";

const template = fs.readFileSync("src/main.mustache", "utf-8");

const getRandomBrowser = (random: number) => {
  if (random === 0) {
    console.log("Using Chromium");
    return playwright.chromium.launch({ headless: true });
  }
  if (random === 1) {
    console.log("Using Firefox");

    return playwright.firefox.launch({ headless: true });
  }
  if (random === 2) {
    console.log("Using Webkit");

    return playwright.webkit.launch({ headless: true });
  }
  console.log("Using fallback");

  return playwright.chromium.launch({ headless: true });
};

async function getImages() {
  const browser = await getRandomBrowser(Math.round(Math.random() * 2));
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Loading page...");
  await page.goto("https://www.picuki.com/profile/nstlopez/", {
    timeout: 80000,
  });
  await page.waitForLoadState("networkidle");
  console.log("Loaded page!");
  console.log("Wait for images...");
  await page.waitForSelector(".post-image", {
    state: "visible",
  });

  const data = await page.evaluate(() => {
    const images: NodeListOf<HTMLImageElement> =
      document.querySelectorAll(".post-image");
    const urls = Array.from(images).map((img) => img.src);

    return urls.slice(0, 3);
  });
  console.log("Got images!");

  console.log("Closing Browser");
  await browser.close();

  return data;
}

async function main() {
  // const images = await getImages();
  const dataToRender = {
    // img1: images[0],
    // img2: images[1],
    // img3: images[2],
    refresh_date: new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
      timeZone: "Europe/Madrid",
    }),
  };
  const source = mustache.render(template, dataToRender);
  fs.writeFileSync("README.md", source, "utf-8");
}

main();
//<h3>My last 3 pictures posted <a href="https://www.instagram.com/nstlopez/" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png" width="20"/> @nstlopez</a><br/>
// </h3><p><img width="200" src="{{img1}}" /> <img width="200" src="{{img2}}" /> <img width="200" src="{{img3}}" /></p>

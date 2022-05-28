import fs from "fs";
import mustache from "mustache";
import playwright from "playwright";

const template = fs.readFileSync("src/main.mustache", "utf-8");

async function getImages() {
  const browser = await playwright.firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.picuki.com/profile/nstlopez/");
  await page.waitForLoadState("load");
  await page.waitForSelector("img", {
    state: "attached",
  });

  const data = await page.evaluate(() => {
    const images: NodeListOf<HTMLImageElement> =
      document.querySelectorAll(".post-image");
    const urls = Array.from(images).map((img) => img.src);

    return urls.slice(0, 3);
  });
  await browser.close();

  return data;
}

async function main() {
  const images = await getImages();
  const dataToRender = {
    img1: images[0],
    img2: images[1],
    img3: images[2],
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
  fs.writeFileSync("README2.md", source, "utf-8");
}

main();

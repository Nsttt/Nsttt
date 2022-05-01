import * as puppeteer from "puppeteer";

class PuppeteerService {
  browser!: puppeteer.Browser;
  page!: puppeteer.Page;

  async init() {
    this.browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-infobars",
        "--window-position=0,0",
        "--ignore-certifcate-errors",
        "--ignore-certifcate-errors-spki-list",
        "--incognito",
      ],
    });
  }

  async goToPage(url: string) {
    if (!this.browser) {
      await this.init();
    }
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      "Accept-Language": "en-US",
    });

    await this.page.goto(url, {
      waitUntil: `networkidle0`,
      timeout: 0,
    });
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }

  async getLatestInstagramPostsFromAccount(acc: string) {
    const page = `https://www.picuki.com/profile/${acc}`;
    await this.goToPage(page);

    try {
      let previousHeight = await this.page.evaluate(
        `document.body.scrollHeight`
      );
      await this.page.evaluate(
        `window.scrollTo(0, document.body.scrollHeight)`
      );
      // await this.page.waitForFunction(
      //   `document.body.scrollHeight > ${previousHeight}`,
      //   { timeout: 0 }
      // );
      await this.page.waitForTimeout(1000);

      const nodes = await this.page.evaluate(() => {
        const images = document.querySelectorAll(`.post-image`);
        return [].map.call(images, (img: any) => img.src);
      });

      return nodes.slice(0, 3);
    } catch (error) {
      console.log("Error loading images: ", error);
      process.exit();
    }
  }
}

export const InstagramScraper = new PuppeteerService();

const puppeteer = require("puppeteer");
class PuppeteerService {
  browser;
  page;

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
        "--proxy-server=http=194.67.37.90:3128",
      ],
    });
  }

  async goToPage(url) {
    if (!this.browser) {
      await this.init();
    }
    this.page = await this.browser.newPage();

    await this.page.setExtraHTTPHeaders({
      "Accept-Language": "en-US",
    });

    await this.page.goto(url, {
      waitUntil: `networkidle0`,
      timeout: 0
    });
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }

  async getLatestInstagramPostsFromAccount(acc, n) {
    const page = `https://www.picuki.com/profile/${acc}`;
    await this.goToPage(page, {
      waitUntil: "load",
      timeout: 0,
    });
    let previousHeight;

    try {
      previousHeight = await this.page.evaluate(`document.body.scrollHeight`);
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
        return [].map.call(images, (img) => img.src);
      });

      return nodes.slice(0, 3);
    } catch (error) {
      console.log("Error", error);
      process.exit();
    }
  }
}

const puppeteerService = new PuppeteerService();

module.exports = puppeteerService;

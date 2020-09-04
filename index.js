const Mustache = require('mustache');
const fs = require('fs');
const puppeteerService = require('./services/puppeteer.service');;

const MUSTACHE_MAIN_DIR = './main.mustache';

async function setInstagramPosts() {
    const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount('nstlopez', 3);
    DATA.img1 = instagramImages[0];
    DATA.img2 = instagramImages[1];
    DATA.img3 = instagramImages[2];
  }

function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
    /**
     * Get pictures
     */
    await setInstagramPosts();
  
    /**
     * Generate README
     */
    await generateReadMe();
  
    /**
     * Fermeture de la boutique 👋
     */
    await puppeteerService.close();
  }
  
  action();
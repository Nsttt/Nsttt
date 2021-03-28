const Mustache = require("mustache");
const fs = require("fs");
const puppeteerService = require("./services/puppeteer.service");
const { getLabels, getProjects } = require("./services/strapi.service");
require("dotenv").config({ path: __dirname + "/.env" });

const MUSTACHE_MAIN_DIR = "./main.mustache";
const backend = `${process.env.HOST}/graphql`;

let DATA = {
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

async function setInstagramPosts() {
  const instagramImages = await puppeteerService.getLatestInstagramPostsFromAccount(
    "nstlopez",
    3
  );
  DATA.img1 = instagramImages[0];
  DATA.img2 = instagramImages[1];
  DATA.img3 = instagramImages[2];
}

async function setLabels() {
  const labels = await getLabels(backend);
  DATA.labels = labels;
}

async function setProjects() {
  const projects = await getProjects(backend);
  DATA.projects = projects;
}

function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

async function action() {
  /**
   * Get pictures
   */
  await setInstagramPosts();

  /**
   * Get labels
   */
  await setLabels();

  /**
   * Get projects
   */
  await setProjects();

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

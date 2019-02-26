const puppeteer = require("puppeteer");
const fs = require("fs");
const imageDownloader = require("image-downloader");

async function main() {
  // Open new page, then go to that page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.instagram.com/phammingngoc/");

  // If there is no folder called "result", then create
  if (!fs.existsSync("./result")) {
    fs.mkdirSync("./result");
  }
  // Get image attribute, called "srcset"
  const imageSrcSets = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("article img"));
    const srcSetAttribute = imgs.map(i => i.getAttribute("srcset"));
    return srcSetAttribute;
  });

  await browser.close();

  // Process and download images
  for (let i = 0; i < imageSrcSets.length; i++) {
    const srcSet = imageSrcSets[i];
    const splitedSrc = srcSet.split(",");
    const imgSrc = splitedSrc[splitedSrc.length - 1].split(" ")[0];
    
    imageDownloader({
      url: imgSrc,
      dest: "./result"
    });
  }
}
main();

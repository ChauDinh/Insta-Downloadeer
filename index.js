const puppeteer = require("puppeteer");
const fs = require("fs");
const imageDownloader = require("image-downloader");

function getLargestImageFromSrcSet(srcSet) {
  const splitedSrcs = srcSet.split(",");
  const imgSrc = splitedSrcs[splitedSrcs.length - 1].split(" ")[0];
  return imgSrc;
}

async function getImagesFromPage(url) {
 // Use puppeteer, can not use normal html parser because...
 const browser = await puppeteer.launch();
 const page = await browser.newPage();
 await page.goto(url);

 const imageSrcSets = await page.evaluate(() => {
  // This might be changed if Instagram change their layout
  const imgs = Array.from(document.querySelectorAll("article img"));
  const srcSetAttribute = imgs.map(i => i.getAttribute("srcset"));
  return srcSetAttribute;
 });

 const imgUrls = imageSrcSets.map(imageSrcSet => getLargestImageFromSrcSet(imageSrcSet));
 await browser.close();
 return imgUrls;
}

async function main() {
 const resultFolder = "./result";
  if (!fs.existsSync(resultFolder)) {
    fs.mkdirSync(resultFolder);
  }
  let inputUrl = 'https://www.instagram.com/phammingngoc/';
  const images = await getImagesFromPage(inputUrl);
  images.forEach(image => {
   imageDownloader({
    url: image,
    dest: resultFolder
   })
  })
}

main();

const pu = require("puppeteer");
const f = require("fs");
const dl = require("image-downloader");

async function main() {
  // Open new page, then go to that page
  var brs = await pu.launch();
  const pg = await brs.newPage();
  await pg.goto("https://www.instagram.com/phammingngoc/");

  // If there is no folder called "result", then create
  if (!f.existsSync("./result")) {
    f.mkdirSync("./result");
  }
  // Get image attribute, called "srcset"
  const srcs = await pg.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("article img"));
    const srcs = imgs.map(i => i.getAttribute("srcset"));
    return srcs;
  });

  await brs.close();

  // Process and download images
  for (let i = 0; i < srcs.length; i++) {
    const sr = srcs[i];
    const s = sr.split(",");
    const rs = s[s.length - 1].split(" ")[0];
    dl({
      url: rs,
      dest: "./result"
    });
  }
}
main();

const express = require('express');
const app = express();

const chrome = require("chrome-aws-lambda");


// const isProd = process.env.NODE_ENV === "production";
const isProd = false;
let puppeteer;
if (isProd) {
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

//Home page
app.use(express.static(__dirname + '/public'));


//API get title
app.get('/title', (req, res) => {
 (async () => {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true
  })
  const page = await browser.newPage()
  await page.setRequestInterception(true);

    page.on("request", req => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

  await page.goto(req.query.url)
  const title = await page.title()
 // console.log(title)
  await browser.close()
  res.send(title)
})()
// res.send(req.query.url)
});

app.listen(process.env.PORT || 8080, function () {
  console.log('Listening on port 8080');
});

// module.exports = app;

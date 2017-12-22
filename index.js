const puppeteer = require('puppeteer');
const scrapeData = require('./utils/dom_utils').scrapeData;

let BROWSER;

async function delay(msMin) {
  const duration = msMin + Math.random() * msMin;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  })
}

async function getHTML(page, delayAmount) {
  await delay(delayAmount);
  return await page.content();
}

async function getPageTitle(page) {
  return page.evaluate(() => {
    return location.href;
  });
}

async function getUserAgent(page) {
  return await page.evaluate(() => {
    return userAgent =  navigator.userAgent;
  });
}

async function launch(opts={}) {
  BROWSER = await puppeteer.launch(opts);
}

async function openPage(opts={}) {
  const page = await BROWSER.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text));

  if ('setJavaScriptEnabled' in opts) {
    await page.setJavaScriptEnabled(opts.setJavaScriptEnabled);
  }

  return page;
}

async function scrapeOnPage(page, delayAmount, args) {
  await delay(delayAmount);

  args = Array.isArray(args) ? args : [args];
  const result = await page.evaluate(scrapeData, ...args);

  return result;
}

async function screenshot(page, path) {
  const screenshot = await page.screenshot({ path });

  return screenshot;
}

async function shutdown() {
  const isClosed = await BROWSER.close();

  return isClosed;
}

async function visitUrl(page, url) {
  await page.goto(url);

  return page;
}

module.exports = () => {
  return {
    delay,
    getHTML,
    getPageTitle,
    getUserAgent,
    launch,
    openPage,
    scrapeOnPage,
    screenshot,
    shutdown,
    visitUrl,
  };
};

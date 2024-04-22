const { S3 } = require('@aws-sdk/client-s3');
const fs = require('fs');
const _ = require('underscore');
const puppeteer = require('puppeteer');
const chromium = require("@sparticuz/chromium");

exports.handler = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  if (event) { 
    generateImage(event, function(err, result) {
      if (err) {
        callback(null, {error: result});
      }
      callback(null, {image: result});
    });
  }
  else {
    callback(null,{error: 'bad query'});
  }
  return;
};

function putObjectToS3(bucket, key, data){
  var s3 = new S3();
  var params = {
    Bucket : bucket,
    Key : key,
    ACL : "public-read",
    Body : data
  }
  s3.putObject(params, function(err, data) {
    if (err) return err;
  });
}

const minimal_args = [
  //'--autoplay-policy=user-gesture-required',
  //'--disable-background-networking',
  //'--disable-background-timer-throttling',
  //'--disable-backgrounding-occluded-windows',
  //'--disable-breakpad',
  //'--disable-client-side-phishing-detection',
  //'--disable-component-update',
  //'--disable-default-apps',
  //'--disable-dev-shm-usage',
  //'--disable-domain-reliability',
  '--disable-extensions',
  //'--disable-features=AudioServiceOutOfProcess',
  //'--disable-hang-monitor',
  //'--disable-ipc-flooding-protection',
  //'--disable-notifications',
  //'--disable-offer-store-unmasked-wallet-cards',
  //'--disable-popup-blocking',
  //'--disable-print-preview',
  //'--disable-prompt-on-repost',
  //'--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  //'--disable-speech-api',
  //'--disable-sync',
  //'--hide-scrollbars',
  //'--ignore-gpu-blacklist',
  //'--metrics-recording-only',
  //'--mute-audio',
  //'--no-default-browser-check',
  //'--no-first-run',
  //'--no-pings',
  '--no-sandbox',
  '--no-zygote',
  //'--password-store=basic',
  //'--use-gl=swiftshader',
  //'--use-mock-keychain',
  '--user-data-dir=/tmp',
];

function generateImage(data, callback) {
  (async () => {
    var wallNumber = data.wallNumber;
    //TODO: validate wallNumber, and if data.niches fits schema
    var cbHTML = fs.readFileSync('cb.html');
    var cbTemplate = _.template(cbHTML.toString());
    var svgInput = cbTemplate({niches: JSON.stringify(data)});

    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
//      headless: 'shell',
//      args: minimal_args,
//      timeout: 0,
//      userDataDir: '/tmp'
    });

    const page = await browser.newPage();
    await page.setContent(svgInput);
    let imageBuffer = await page.screenshot({
      type: 'png',
      omitBackground: true,
      clip: {
        x: 0,
        y: 0,
        height: 531,
        width: 600
      }
    });
    for (const page of await browser.pages()) {
      await page.close();
    }
    await browser.close();

    var s3Error = putObjectToS3("columbariumimage","wallImages/wall" + wallNumber + ".png", imageBuffer);
    if (s3Error) callback(true, s3Error);
    else callback(null, imageBuffer.toString('base64'));
    return;
    })();

    return;
}

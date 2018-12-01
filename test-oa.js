const puppeteer = require('puppeteer-core');
const devices = require('puppeteer-core/DeviceDescriptors');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        headless: true
    });
    const page = await browser.newPage();
    await page.emulate(devices['iPad']);
    await page.goto('http://ics.chinasoftosg.com/', { waitUntil: 'networkidle2' });

    await page.type('input[name="userName"]', 'xxxx');
    await page.type('#password', 'xxxx');
    await page.click('input[type="button"][class="button"]');

    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    await browser.close();
})();
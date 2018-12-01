const puppeteer = require('puppeteer-core');
const devices = require('puppeteer-core/DeviceDescriptors');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://mail.163.com/', { waitUntil: 'networkidle2' });

    const allFrames = await page.mainFrame().childFrames();
    let targetFrame = allFrames.find(it => it.url() !== 'about:blank');
    await targetFrame.type('input[name="email"', 'xxxx');
    await targetFrame.type("input[name='password']", 'xxxx');
    await targetFrame.click("#dologin");

    await page.screenshot({ path: 'test.png', fullPage: true });
    await browser.close();
})();
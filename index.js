"use strict";
const $ = require('cheerio');
const request = require('request');
const url = require('url');
const bundles = require('./bundles.json');
const fs = require('fs');
const test = (name, _url) => {
    request(_url, (error, response, body) => {
        var t = $(body).find("div.body a").filter((i, item) => {
            return $(item).text() === 'Windows';
        });
        var fileUrl = $(t[0]).prop("href");
        console.log(fileUrl)
        var { pathname, hostname } = url.parse(fileUrl);
        var newVersion = pathname.split('/')[1];
        if (newVersion !== bundles[name].version) {
            console.log(newVersion);
            if (!fs.existsSync(`./${name}-dist`)) {
                fs.mkdirSync(`./${name}-dist`);
            }
            var ws = fs.createWriteStream(`./${name}-dist/${name}-${newVersion}.exe`);
            ws.on('close', () => {
                console.log('download finished...........');
                bundles[name].version = newVersion;
                console.log(bundles);
                fs.writeFileSync('bundles.json', JSON.stringify(bundles, null, 2));
            })
            request(fileUrl).pipe(ws);
        }
    });
};

const cmdArgv = process.argv;
if (cmdArgv.length < 3) {
    console.log("...............");
} else {
    var bunleName = cmdArgv[2];
    if (bundles[bunleName]) {
        test(bunleName, bundles[bunleName]);
    }
}


'use strict';
const request = require('request');
const bundles = require('./bundles.json');
const fs = require('fs');
const parser = require('./parser');

const test = (name, _url) => {
    request(_url, (error, response, body) => {
        var { newVersion, downloadURL } = parser[bundles[name].parser](body);
        if (newVersion !== bundles[name].version) {
            console.log(newVersion);
            if (!fs.existsSync(`./${name}-dist`)) {
                fs.mkdirSync(`./${name}-dist`);
            }
            var ws = fs.createWriteStream(`./${name}-dist/${name}-${newVersion}.exe`);
            ws.on('close', () => {
                console.log(`${name} download finished...........`);
                bundles[name].version = newVersion;
                console.log(bundles);
                fs.writeFileSync('bundles.json', JSON.stringify(bundles, null, 2));
            })
            request(downloadURL).pipe(ws);
        }
    });
};

const cmdArgv = process.argv;
if (cmdArgv.length < 3) {
    console.log('...............');
} else {
    var bunleName = cmdArgv[2];
    if (bundles[bunleName]) {
        test(bunleName, bundles[bunleName]);
    }
}


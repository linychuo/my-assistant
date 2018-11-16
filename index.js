const request = require('request-promise-native');
const bundles = require('./bundles.json');
const fs = require('fs');
const parser = require('./parser');

const getInfo = async (name, url) => {
	let body = await request(url);
	return parser[bundles[name].parser](body);
};

const downloadFile = (name, newVersion, downloadURL) => {
	if (!fs.existsSync(`./${name}-dist`)) {
		fs.mkdirSync(`./${name}-dist`);
	}
	let ws = fs.createWriteStream(`./${name}-dist/${name}-${newVersion}.exe`);
	let closePromise = new Promise((resolve, reject) => {
		ws.on('close', () => {
			console.log(`3. ${name} finish downloading file`);
			resolve();
		});
	});

	console.log(`2. ${name} start to download, url is ${downloadURL}`);
	request(downloadURL).pipe(ws);
	return closePromise;
};

const updateInfo = (name, newVersion) => {
	bundles[name].version = newVersion;
	console.log(`4. update bundle[${name}] file`);
	fs.writeFileSync('bundles.json', JSON.stringify(bundles, null, 2));
};

const main = async (name, url) => {
	let { newVersion, downloadURL } = await getInfo(name, url);
	console.log(`1. ${name}: current version is ${newVersion}, older Version is ${bundles[name].version}`);
	if (newVersion !== bundles[name].version) {
		downloadFile(name, newVersion, downloadURL).then(() => updateInfo(name, newVersion));
	}
};

const cmdArgv = process.argv;
if (cmdArgv.length < 3) {
	console.log('All tasks will running async!!');
	Object.entries(bundles).forEach(([k, v]) => {
		process.nextTick(() => {
			main(k, v.url);
		});
	});
}
else {
	let bundleName = cmdArgv[2];
	if (bundles[bundleName]) {
		main(bundleName, bundles[bundleName].url);
	}
}

const $ = require('cheerio');
const url = require('url');

exports.fetchVersionOfVSCode = body => {
	let t = $(body).find('div.body a').filter((i, item) => $(item).text() === 'Windows');
	let downloadURL = $(t[0]).prop('href');
	let newVersion = url.parse(downloadURL).pathname.split('/')[1];
	return { newVersion, downloadURL };
};

exports.fetchVersionOfSublime = body => {
	let downloadURL = $(body).find('span.win, span.show_64').find('a').prop('href');
	let newVersion = $(body).find('div.current_version i').text();
	return { newVersion, downloadURL };
};

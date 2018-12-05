const $ = require('cheerio');
const url = require('url');

exports.fetchVersionOfVSCode = body => {
	let t = $(body).find('div.body a').filter((i, el) => $(el).text() === 'Windows');
	let downloadURL = $(t[0]).prop('href');
	let newVersion = url.parse(downloadURL).pathname.split('/')[1];
	return { newVersion, downloadURL };
};

exports.fetchVersionOfSublime = body => {
	let downloadURL = $(body).find('span.win, span.show_64').find('a').prop('href');
	let newVersion = $(body).find('div.current_version i').text();
	return { newVersion, downloadURL };
};

exports.fetchVersionOfRust = body => {
	// https://forge.rust-lang.org/other-installation-methods.html
	let t = $(body).find('div.installer-table.stable a')
		.filter((i, el) => $(el).prop('href').endsWith('x86_64-pc-windows-gnu.msi'));
	let downloadURL = $(t[0]).prop('href');
	t = $(body).find('h3').filter((i, el) => $(el).text().startsWith('Stable'));
	let newVersion = $(t[0]).text();
	return { newVersion, downloadURL };
};

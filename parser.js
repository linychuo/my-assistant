const $ = require('cheerio');
const url = require('url');

exports.fetchVersionOfVSCode = body => {
    var t = $(body).find('div.body a').filter((i, item) => {
        return $(item).text() === 'Windows';
    });
    var fileURL = $(t[0]).prop('href');
    console.log(fileURL);
    var { pathname, hostname } = url.parse(fileURL);
    return { 'newVersion': pathname.split('/')[1], 'downloadURL': fileURL };
};

exports.fetchVersionOfSublime = body => {
    var fileURL = $(body).find('span.win, span.show_64').find('a').prop('href');
    console.log(fileURL);
    var newVersion = $(body).find('div.current_version i').text();
    return { 'newVersion': newVersion, 'downloadURL': fileURL };
};
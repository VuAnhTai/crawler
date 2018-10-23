const cheerio = require('cheerio')
const request = require('request-promise')
const jsonfile = require('jsonfile')

const URL = 'https://vnexpress.net'
const file = './storge/data.json'

const getPagearticle = (url) => {
    const options = {
        url,
        header: {
            'User-Agent': 'Request-Promise'
        },
        transform: (body) => {
            return cheerio.load(body)
        }
    }
    return request(options)
}

const html2json = ($) => {
    title_link = $.find('.title_news a').attr("href"),
    title_text = $.find('.title_news a').attr("title"),
    related_link = $.find('.related_news a').attr("href"),
    related_text = $.find('.related_news a').attr("title"),
    description = $.find('.description').text()
    article = {
        title_link: title_link,
        title_text: title_text,
        related_link: related_link,
        related_text: related_text,
        description: description
    }
    return article
}

const getDatePage =  (url) => {
    getPagearticle(url).then($ => {
        titlePage = $('title').text();
        let articles = []
        titles = $('.title_news')
        titles.each((_, c) => {
            article = $(c).parent()
            article = html2json(article);
            articles.push(article);
        })
        page = {
            titlePage: titlePage,
            articles: articles
        }
        // write file json
        jsonfile.writeFile(file, page, { spaces: 2, EOL: '\r\n' }, function (err) {
            if (err) console.error(err)
        })
    })
}



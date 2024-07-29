const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');
const url = 'https://www.rts.rs/';


router.post('/scraper', auth, async (req, res) => {

try {
    const response2 = await axios(req.body.url);
    const html2 = response2.data;
    $ = cheerio.load(html2);
    const title = $('h1').text();
    const subtitle = $('p.lead').text();
    const paragraphs = $('#story-text > p');
    let text = '';
    paragraphs.each(function(){
        text = text + '<p>' + $(this).text() + '</p>';
    })
    const scrapedArticle = {
        title,
        subtitle,
        text
    }
    res.json({scrapedArticle: scrapedArticle});
} catch (error) {
    return res.json({error: modifyError(error)});
}
   
})

module.exports = router;
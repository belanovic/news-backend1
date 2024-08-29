const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');
const dateQuery = require('./dateQuery');

router.post('/allArticles', auth, async (req, res) => {
 

    const Article = require('../models/Article')(req.headers.origin);

    const category = req.body.category;
    const pageNum = parseInt(req.body.pageNum.number);
    const title = req.body.title;
    const tag = req.body.tag;
    const regTitle = new RegExp(`${title}`, 'gi');
    const regTag = new RegExp(`${tag}`, 'gi');
 
    try {

        let articles = await Article
            .find(category == 'allArticles'? 
                {
                    title: {$regex: regTitle},
                    tagsArr: {$in: [regTag]},
                    dateCreated: dateQuery(req.body.selectedDate)
                }
                : 
                {
                    title: {$regex: regTitle},
                    tagsArr: {$in: [regTag]},
                    category: category,
                    dateCreated: dateQuery(req.body.selectedDate)
                }
            )
            .skip((pageNum - 1) * 10)
            .limit(10)
            .sort({dateUpdated: -1})

        res.json({articlesMsg: {
            articles: articles
        }});
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;



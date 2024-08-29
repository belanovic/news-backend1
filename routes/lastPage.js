const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');
const dateQuery = require('./dateQuery');



router.post('/lastPage', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    const category = req.body.category;
    const title = req.body.title;
    const tag = req.body.tag;
    const regTitle = new RegExp(`${title}`, 'gi');
    const regTag = new RegExp(`${tag}`, 'gi');

    try {
        let count = await Article.find(category == 'allArticles'? 
        {
            title: {$regex: regTitle},
            dateCreated: dateQuery(req.body.selectedDate)
        }
        : 
        {
            title: {$regex: regTitle},
            tagsArr: {$regex: regTag},
            category: category,
            dateCreated: dateQuery(req.body.selectedDate)
        })
        .countDocuments()

        const articles = await Article
            .find(category == 'allArticles'? 
                {
                    title: {$regex: regTitle},
                    dateCreated: dateQuery(req.body.selectedDate)
                }
                : 
                {
                    title: {$regex: regTitle},
                    tagsArr: {$regex: regTag},
                    category: category,
                    dateCreated: dateQuery(req.body.selectedDate)
                }
            )
            .sort({dateUpdated: 1})
            .limit(count % 10 == 0? 10 : count % 10)
        
        res.json({articlesMsg: {
            articles: articles,
            numOfPages: Math.ceil(count/10)
        }})
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
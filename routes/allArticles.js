const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');

router.post('/allArticles', auth, async (req, res) => {
    console.log(req.headers.origin);
    const category = req.body.category;
    const pageNum = parseInt(req.body.pageNum.number);
    const title = req.body.title;
    const tag = req.body.tag;
    const regTitle = new RegExp(`${title}`, 'gi');
    const regTag = new RegExp(`${tag}`, 'gi');
 

    try {
        let count = await Article.find(category == 'allArticles'? 
        {
            title: {$regex: regTitle},
            tagsArr: {$in: [regTag]}
        }
        : 
        {
            title: {$regex: regTitle},
            tagsArr: {$in: [regTag]},
            category: category
        })
        .countDocuments()

        let articles = await Article
            .find(category == 'allArticles'? 
                {
                    title: {$regex: regTitle},
                    tagsArr: {$in: [regTag]}
                }
                : 
                {
                    title: {$regex: regTitle},
                    tagsArr: {$in: [regTag]},
                    category: category
                }
            )
            .skip((pageNum - 1) * 10)
            .limit(10)
            .sort({dateUpdated: -1})

        if(req.body.selectedDate != null) {
            const queryDate = new Date(req.body.selectedDate).toDateString();
            articles = articles.filter((article) => {
                return article.dateCreated.toDateString() == queryDate
            })
        }
        res.json({articlesMsg: {
            articles: articles
        }});
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;



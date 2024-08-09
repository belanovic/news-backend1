const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');



router.post('/getLatestNews', async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    const count = parseInt(req.body.count);
    const category = req.body.category;

    try {
        let latestNews;
        if(category == 'all') {
            latestNews = await Article
            .find({
                published: true
            })
            .sort({datePublished: -1})
            .limit(count)
        }
        if(category != 'all') {
            latestNews = await Article
            .find({
                published: true,
                category: category
            })
            .sort({datePublished: -1})
            .limit(count)
            
        }
        res.json({latestNews: latestNews}); 
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror')



router.get('/frontpageArticlesCMS', auth, async (req, res) => {
    
    const Article = require('../models/Article')(req.headers.origin);

    try {
        const articles = await Article
            .find({
                position: {$gt: 0, $lt: 100},
                published: true
            }) 
            .sort({position: 1}) 
        res.json({articles: articles});
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})
router.get('/frontpageArticlesFE', async (req, res) => {

    const Article = require('../models/Article')(req.headers.origin);

    try {
        const frontpageArticles = await Article
            .find({
                position: {$gt: 0, $lt: 100},
                published: true
            })
            .sort({position: 1}) 
        res.json({frontpageArticles: frontpageArticles}); 
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');

router.put('/publishArticle/:id', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    try {
        const publishedArticle = await Article.findByIdAndUpdate(
            req.params.id, 
            {published: req.body.published, 
                datePublished: req.body.datePublished, 
                dateUpdated: req.body.dateUpdated
            },
            {new: true}
        );
        res.json({publishedArticle: publishedArticle});
    }
    catch(error){
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
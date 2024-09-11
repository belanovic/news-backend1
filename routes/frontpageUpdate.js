const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');


router.put('/updateFrontpage', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    try {
        const allArticles = await Article.find();
        const modifiedAllArticles = allArticles.map((prom) => {
    
            const idMatch = req.body.idAndPositionArr.filter((idAndPosition) => {
                return idAndPosition.id === prom._id.toString()
            });
            const newArticlePosition = idMatch.length > 0? parseInt(idMatch[0].newPosition) : 0;
            const modifiedArticle = prom;
            modifiedArticle.position = newArticlePosition;
            if(idMatch.length > 0) {
                modifiedArticle.published = true;
            }
            return modifiedArticle
        })
        /* modifiedAllArticles.sort((a, b) => a.position - b.position) */

        modifiedAllArticles.forEach(async (prom) => {
            const article = await Article.findByIdAndUpdate(prom._id, {position: prom.position, published: prom.published}, {new: true});
        })

        const frontpageArticles = await Article
            .find({
                position: {$gt: 0, $lt: 100},
                published: true
            }) 
            .sort({position: 1}) 
        res.json({frontpageArticles: frontpageArticles});
    }
    catch(error){
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');


router.put('/updateFrontpage', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    try {
        const allArticles = await Article.find();
        const modifiedAllArticles = allArticles.map((prom) => {
    
            const idAndPositionMatch = req.body.idAndPositionArr.filter((idAndPosition) => {
                return idAndPosition.id === prom._id.toString()
            });
            const newArticlePosition = idAndPositionMatch.length > 0? parseInt(idAndPositionMatch[0].newPosition) : 0;
           /*  const modifiedArticle = Object.assign({}, prom);
            modifiedArticle.position = newArticlePosition;
            return modifiedArticle; */
            const modifiedArticle = prom;
            modifiedArticle.position = newArticlePosition;
            return modifiedArticle
        })
        /* modifiedAllArticles.sort((a, b) => a.position - b.position) */

        modifiedAllArticles.forEach(async (prom) => {
            const article = await Article.findByIdAndUpdate(prom._id, {position: prom.position}, {new: true});
        })

        /* const article = await Article.findByIdAndUpdate(req.params.id, {position: req.body.position}, {new: true}); */
        res.json({modifiedAllArticles: modifiedAllArticles});
    }
    catch(error){
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
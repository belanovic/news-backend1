const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');


router.put('/articlePosition/:id', auth, async (req, res) => {

    const Article = require('../models/Article')(req.headers.origin);
    
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, {position: req.body.position}, {new: true});

        return res.json({updatedArticle: article});
    }
    catch(error){
        return res.json({error: modifyError(error)});
    }
})

module.exports = router; 
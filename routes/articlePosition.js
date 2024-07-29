const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');

router.put('/articlePosition/:id', auth, async (req, res) => {
    
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, {position: req.body.position}, {new: true});

        return res.json({updatedArticle: article});
    }
    catch(error){
        console.log('eovo meeeeeee')
        return res.json({error: modifyError(error)});
    }
})

module.exports = router; 
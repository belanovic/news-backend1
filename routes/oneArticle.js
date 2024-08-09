const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');


router.get('/oneArticleCMS/:id', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    try {
        const articleFound = await Article.findById(req.params.id); 
        return res.json({articleFound: articleFound});
    }
    catch(error){
        return res.json({error: modifyError(error)});
    }
})
router.get('/oneArticleFE/:id', async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);

    try {
        const articleFound = await Article.findById(req.params.id);
        return res.json({articleFound: articleFound});
    }
    catch(error){
        return res.json({error: modifyError(error)});
    }
})

router.post('/oneArticle', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    const oneArticle = new Article({
        category: req.body.category,
        published: req.body.published,
        position: req.body.position,
        title: req.body.title,
        supertitle: req.body.supertitle,
        subtitle: req.body.subtitle,
        text: req.body.text,
        paragraphs: req.body.paragraphs,
        imgURL: req.body.imgURL,
        imgName: req.body.imgName,
        imgURL2: req.body.imgURL2,
        imgName2: req.body.imgName2,
        imgFilter: req.body.imgFilter,
        imgFilter2: req.body.imgFilter2,
        videoURL: req.body.videoURL,
        videoName: req.body.videoName,
        dateCreated: req.body.dateCreated,
        dateUpdated: req.body.dateUpdated,
        datePublished: req.body.datePublished, 
        imgDescription: req.body.imgDescription, 
        videoDescription: req.body.videoDescription, 
        source: req.body.source,
        author: req.body.author,
        tagsArr: req.body.tagsArr, 
        note: req.body.note
    })
    try{
        const savedArticle = await oneArticle.save();
        return res.json({savedArticle: savedArticle});

    }catch(error) {
        return res.json({error: modifyError(error)});
    }

})

router.put('/oneArticle/:id', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    function UpdateMsg(isSuccess, result) {
        this.isSuccess = isSuccess; 
        if(isSuccess) {
            this.userUpdated = result;
        }
        if(!isSuccess) {
            this.failureMsg = result;
        }
    }
    try {
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, {new: true});
  
        if(!updatedArticle) {
            return res.json({updateMsg: new UpdateMsg(false, 'There was a problem with the update')})
        }
        return res.json({updateMsg: new UpdateMsg(true, updatedArticle)});
    }
    catch(error){
        res.json({error: modifyError(error)});
    }
})

router.delete('/oneArticle/:id', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    try {
        const articleDeleted = await Article.findByIdAndDelete(req.params.id);
        res.json({articleDeleted: articleDeleted});
    }
    catch(error){
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
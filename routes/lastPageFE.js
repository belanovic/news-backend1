const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');



router.post('/lastPageFE', async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    const category = req.body.category;
    const tag = req.body.tag;
    if(tag == 'vesti') {tag = undefined}

    try {
        const count = await Article
            .find({category: category})
            .countDocuments()

        const newsByCategory = await Article
            .find(tag == undefined? 
            {
                category: category
            }
            : 
            {
                category: category,
                tagsArr: {$in: [tag]}
            })
            .sort({dateUpdated: 1})
            .limit(count % 10)
        
        res.json({newsMsg: {
            newsByCategory: newsByCategory,
            numOfPages: Math.ceil(count/10)
        }})
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
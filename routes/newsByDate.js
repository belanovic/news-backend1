const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');


router.post('/articlesByDate', auth, async (req, res) => {
    const Article = require('../models/Article')(req.headers.origin);
    function NewsByDateMsg(isSuccess, result) {
        this.isSuccess = isSuccess; 
        if(isSuccess) {
            this.newsByDate = result;
        }
        if(!isSuccess) {
            this.failureMsg = result;
        }
    }
    try {
        const articlesPublished = await Article
            .find({
                published: true
            })
   
        let newsByDate = articlesPublished.filter((prom) => {
            const day = prom.datePublished.getDate();
            const month = prom.datePublished.getMonth();
            const year = prom.datePublished.getFullYear();

          /*   console.log('day: ' + day, 'month: ' + month, 'year: ' + year); */

            return (day === req.body.day) && (month === req.body.month) && (year === req.body.year)
        })
        if(newsByDate.length === 0) {
            return res.json({newsByDateMsg: new NewsByDateMsg(false, 'Nema vesti sa tim datumom')})
        }
        return res.json({newsByDateMsg: new NewsByDateMsg(true, newsByDate)})
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
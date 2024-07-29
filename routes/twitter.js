const express = require('express');
const router = express.Router();
var Twit = require('twit');
const auth = require('../middleware/auth');
const modifyError = require('modifyerror');

const T = new Twit({
    consumer_key: 'CwE9zZzMc1jbCWGByKuLWIbi6',
    consumer_secret: 'H1XMToXsQiPb99tpWA3WUjhopPzW1oc9JEOjPTuVKILbSB9FSL',
    access_token: '1424881417541017605-uLDViNeAyb4VoSoQvMGhySRhXwr3C8',
    access_token_secret: 'ulKvAyVIoT6P54KPlnbeTH5r1wwYRH7va7ysbC4UEizsJ'
})

router.post('/publishTwit', auth, async (req, res) => {

    console.log(req.body.twit)

    try{
        T.post('statuses/update', { status: `${req.body.twit}` }, function (err, data, response) {
            res.json({responseTwitt: response});
        }) 
    }catch(error) { 
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
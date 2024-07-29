const express = require('express');
const router = express.Router();
const cors = require('cors');

router.get('/proba', cors({origin: 'http://localhost:3000'}), async (req, res) => {
    try {
        const odgovor = {
            poruka: 'Ovo je poruka sa cookie-em'
        }

        res.cookie('kolacic', 'vrednost')
        res.json(odgovor)
    }
    catch(error) {
        res.json({error: modifyError(error)});
    }
})

router.get('/probaa', (req, res) => {

    const obj = {broj: 3333}
    res.cookie('kolacic', 'vrednostiiii').json(obj)
})

module.exports = router;
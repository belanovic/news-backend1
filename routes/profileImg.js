const express = require('express');
const router = express.Router();
const { validateUserAuth } = require('../models/User');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { result } = require('lodash'); 
const auth = require('../middleware/auth');
const modifyError = require('modifyerror'); 

router.post('/updateProfilePhotoURL/:size', auth, async (req, res) => { 

    const { createModel } = require('../models/User');
    const User = createModel(req.headers.origin)

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
        let resultUser = await User.findOne({ username: req.body.username});
        if (!resultUser) return res.json({updateMsg: new UpdateMsg(false, `Invalid username or password`)});

        resultUser = await User.findOne({ email: req.body.email });
        if (!resultUser) return res.json({updateMsg: new UpdateMsg(false, `Invalid email`)});
        
        const size = req.params.size;
        let update;

        if(size === 'large') {
            update = {
                profileImgNameLarge: req.body.profileImgNameLarge,
                profileImgURLLarge: req.body.profileImgURLLarge
            }
        } else if(size === 'small') {
            update = {
                profileImgURLSmall: req.body.profileImgURLSmall,
                profileImgNameSmall: req.body.profileImgNameSmall
            }
        }

        let updatedUser = await User.findOneAndUpdate({username: resultUser.username}, update, {new: true});
        if (!updatedUser) return res.json({updateMsg: new UpdateMsg(false, `Problem with updating profile image`)});

        return res.json({updateMsg: new UpdateMsg(true, updatedUser)});

    } catch (error) {
        res.json({error: modifyError(error)});
    }
})

module.exports = router;
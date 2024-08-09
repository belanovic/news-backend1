const express = require('express');
const router = express.Router();
const { validateData } = require('../models/User');

const _ = require('lodash');
const bcrypt = require('bcrypt');
const modifyError = require('modifyerror');


router.post('/login', async (req, res) => {

    const { createModel } = require('../models/User');
    const User = createModel(req.headers.origin)

    function LoginMsg(isSuccess, result, token) {
        this.isSuccess = isSuccess; 
        if(isSuccess) {
            this.userLoggedIn = result;
            this.token = token
        }
        if(!isSuccess) {
            this.failureMsg = result;
        }
    }

    try {
        const userData = req.body; 
        
        const {error} = validateData('login', userData);
        if(error) return res.json({loginMsg: new LoginMsg(false, error.message)});

        const userRegistered = await User.findOne({username: userData.username});
        if(!userRegistered) return res.json({loginMsg: new LoginMsg(false, `User with username ${userData.username} doesn't exist`)});

        const passwordCorrect = await bcrypt.compare(userData.password, userRegistered.password);
        if(!passwordCorrect) return res.json({loginMsg: new LoginMsg(false, `Username or password are incorrect`)});
  
        /* const token = jwt.sign(userData, config.get('jwtPrivateKey'), {expiresIn: '55m'}); */
        const token = userRegistered.generateToken();
        
        /* res.cookie('token', token, {httpOnly: false, sameSite: 'lax', secure: true}) */
        return res.json({loginMsg: new LoginMsg(true, userRegistered, token)})

    } catch (error) {
        return res.json({error: modifyError(error)});
    }
})

/* router.post('/login', async (req, res) => {  

    const { error } = validateUserAuth(_.pick(req.body, ['username', 'password']));
    if (error) res.status(400).send([false, 'validation_error', error.details[0].message]);

    const resultUsername = await User.findOne({ username: req.body.username });
    if (!resultUsername) res.status(400).send([false, 'username_error', `Invalid username or password`]);
    
    const resultPassword = await bcrypt.compare(req.body.password, resultUsername.password);
    if (!resultPassword) res.status(400).send([false, 'password_error', `Invalid username or password`]);

    const token = resultUsername.generateToken();

    try {
        let msg = [true, 'login_successfull', resultUsername, token];
        res.send(msg);
    }
    catch (err) {
        let msg = ['login_error', err]
        res.send(msg);
    }
}) */

module.exports = router;
/* 
function modifyError(error) {
    if(error.name =='MongooseError'
    || error.name =='CastError'
    || error.name =='DivergentArrayError'
    || error.name =='MissingSchemaError'
    || error.name =='DocumentNotFoundError'
    || error.name =='ValidatorError'
    || error.name =='ValidationError'
    || error.name =='MissingSchemaError'
    || error.name =='ObjectExpectedError'
    || error.name =='ObjectParameterError'
    || error.name =='OverwriteModelError'
    || error.name =='ParallelSaveError'
    || error.name =='StrictModeError'
    || error.name =='VersionError') {
        error.message = `Problem with the database. ${error.name}`;
    }
    const stringifiedError = JSON.stringify(error, Object.getOwnPropertyNames(error));
    return JSON.parse(stringifiedError)
} */
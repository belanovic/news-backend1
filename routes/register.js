const express = require('express');
const router = express.Router();
const { User, validateData } = require('../models/User');
const _ = require('lodash');
const bcrypt = require('bcrypt');
/* const modifyError = require('modify_error'); */

router.post('/register', async (req, res) => {
   
    function RegistrationMsg(isSuccess, result) {
        this.isSuccess = isSuccess; 
        if(isSuccess) {
            this.userRegistered = result;
        }
        if(!isSuccess) {
            this.failureMsg = result;
        }
    }
    try {
        let userData = req.body;
        const {error} = validateData('register', userData);
        if(error) {
            return res.json({registrationMsg: new RegistrationMsg(false, error.message)});
        }
        const alreadyRegistered = await User.findOne({username: userData.username});
        if(alreadyRegistered) {
            return res.json({registrationMsg: new RegistrationMsg(false, `Username ${alreadyRegistered.username} is already taken`)})
        }
        const salt = await bcrypt.genSalt(5);
        const passwordHash = await bcrypt.hash(userData.password, salt);
        userData.password = passwordHash;
        
        const newUser = new User(userData);
        const userSaved = await newUser.save();
        return res.json({registrationMsg: new RegistrationMsg(true, userSaved)});
    } catch (error) {
        return res.json({error: modifyError(error)});
    }
})

module.exports = router;

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
}

/* router.post('/register', async (req, res) => {

    async function hash(password) {
            const salt = await bcrypt.genSalt(5);
            const hashed = await bcrypt.hash(password, salt);
            return hashed
        }
            
    const { error } = validateUser(req.body);
    if (error) res.status(400).send([false, 'validation_error', error.details[0].message]);

    const resultEmail = await User.findOne({ email: req.body.email });

    if (resultEmail) res.status(400).send([false, 'email_error', `User with email address ${req.body.email} is already registered`])

    const resultUsername = await User.findOne({ username: req.body.username });

    if (resultUsername) res.status(400).send([false, 'username_error', `User with username ${req.body.username} is already registered`])

    const hashedPassword = await hash(req.body.password);

    const oneUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        profileImgNameLarge: req.body.profileImgNameLarge,
        profileImgURLLarge: req.body.profileImgURLLarge,
        profileImgURLSmall: req.body.profileImgURLSmall,
        profileImgNameSmall: req.body.profileImgNameSmall

    })

    const token = oneUser.generateToken();

    try {
        const savedOneUser = await oneUser.save();
        let msg = [true, 'registration_successfull', savedOneUser, token];
        res.json(msg);
    }
    catch (error) {
        let msg = [false, 'registration_error', error]
        res.json(msg);
    }
})
module.exports = router;


 */


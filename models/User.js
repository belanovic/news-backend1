const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    username: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true
    },
    password: {
        type: String,
        minLength: 6,
        maxLength: 1024,
        required: true
    },
    email: {
        type: String,
        minLength: 10,
        maxLength: 60,
        required: true
    },
    profileImgURLLarge: {
        type: String,
        minLength: 7,
        maxLength: 10000,
        required: true
    },
    profileImgNameLarge: {
        type: String,
        minLength: 7,
        maxLength: 10000,
        required: true
    },
    profileImgURLSmall: {
        type: String,
        minLength: 7,
        maxLength: 10000,
        required: true 
    },
    profileImgNameSmall: {
        type: String,
        minLength: 7,
        maxLength: 10000,
        required: true
    }    

})




userSchema.methods.generateToken = function () {
    const token = jwt.sign(_.pick(this, ['_id', 'username']), config.get('jwtPrivateKey'));
    return token
}



function validateUser(user) {
    const schema = Joi.object( {
        firstName: Joi.string().min(3).max(50).required(),
        lastName:  Joi.string().min(3).max(50).required(),
        username:  Joi.string().min(3).max(50).required(),
        password:  Joi.string().min(6).max(255).required(),
        email:  Joi.string().min(10).max(60).email().required(),
        profileImgNameLarge: Joi.string().min(7).max(10000).required(),
        profileImgURLLarge: Joi.string().min(7).max(10000).required(),
        profileImgURLSmall: Joi.string().min(7).max(10000).required(),
        profileImgNameSmall: Joi.string().min(7).max(10000).required()
    })
    return schema.validate(user);
}
function validateUserAuth(userAuth) {
    const schema = Joi.object( {
        username:  Joi.string().min(3).max(50).required(),
        password:  Joi.string().min(6).max(255).required()
    })
    return schema.validate(userAuth);
}


module.exports.validateUser = validateUser;
module.exports.validateUserAuth = validateUserAuth;
module.exports.validateData = validateData;
module.exports.createModel = createModel;

const copies = config.get('copies').split(' ');

function createModel(origin) {

    let userSuffix;

    copies.forEach((copy, i) => {
        if(origin.includes('localhost')) {
            userSuffix = '';
            return;
        }
        if(origin.includes(copy)) {
            userSuffix = copy;
            if(copy == '0') userSuffix == '';
        }
        
    })
    
    return mongoose.model(`user${userSuffix}`, userSchema);
}

function validateData(type, userData) {
    let template;
    if(type == 'register') {
        template = {
            firstName: Joi.string().min(3).max(50).required(),
            lastName:  Joi.string().min(3).max(50).required(),
            username:  Joi.string().min(3).max(50).required(),
            password:  Joi.string().min(6).max(255).required(),
            email:  Joi.string().min(10).max(60).email().required(),
            profileImgNameLarge: Joi.string().min(7).max(10000).required(),
            profileImgURLLarge: Joi.string().min(7).max(10000).required(),
            profileImgURLSmall: Joi.string().min(7).max(10000).required(),
            profileImgNameSmall: Joi.string().min(7).max(10000).required()
        }
    } else if(type == 'login') {
        template = {
            username: Joi.string().min(3).max(50).required(),
            password: Joi.string().min(6).max(255).required()
        }
    } else {
        return;
    }
    const joiSchema = Joi.object(template);
    return joiSchema.validate(userData);
}




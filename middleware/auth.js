const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash')


function auth(req, res, next) {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.userData = _.pick(decodedPayload, ['username', 'password']);
        next()
    } catch (error) {
        /* return res.status(401).clearCookie('token').json({error: modifyError(error)}); */
        return res.status(401).json({error: modifyError(error)});
    }
}

module.exports = auth;

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
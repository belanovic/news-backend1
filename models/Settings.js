const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');

const settingsSchema = new mongoose.Schema({
    settings: {}
})

const copies = config.get('copies').split(' ');

module.exports = function createModel(origin) {
    let settingsSuffix = '';

    copies.forEach((copy, i) => {

        if(origin.includes('localhost')) {
            settingsSuffix = ''
            return
        }

        if(origin.includes(copy)) {
            settingsSuffix = copy;
        }

        
    })
    
    return mongoose.model(`settings${settingsSuffix}`, settingsSchema);
}

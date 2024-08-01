const mongoose = require('mongoose');
const Joi = require('joi');

const settingsSchema = new mongoose.Schema({
    settings: {}
})

const Settings = mongoose.model('settings1', settingsSchema);

module.exports = Settings;

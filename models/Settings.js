const mongoose = require('mongoose');
const Joi = require('joi');

const settingsSchema = new mongoose.Schema({
    settings: {}
})

const Settings = mongoose.model('settings', settingsSchema);

module.exports = Settings;

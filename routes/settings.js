const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const modifyError = require('modifyerror');

router.get('/getSettingsCMS', auth, async (req, res) => {
    
    const Settings = require('../models/Settings')(req.headers.origin);
     
    function SettingsMsg(isSuccess, result) {
        this.isSuccess = isSuccess; 
        if(isSuccess) {
            this.settings = result;
        }
        if(!isSuccess) {
            this.failureMsg = result;
        }
    }

    try {
        const settingsSchemaObj = await Settings.find();
        return res.json({settingsMsg: new SettingsMsg(true, JSON.parse(settingsSchemaObj[0].settings))});
    }

    catch(error){
        res.json({error: modifyError(error)});
    }
})
router.get('/getSettingsFE', async (req, res) => {
    
    const Settings = require('../models/Settings')(req.headers.origin);
     
    function SettingsMsg(isSuccess, result) {
        this.isSuccess = isSuccess; 
        if(isSuccess) {
            this.settings = result;
        }
        if(!isSuccess) {
            this.failureMsg = result;
        }
    }

    try {
        const settingsSchemaObj = await Settings.find();
        return res.json({settingsMsg: new SettingsMsg(true, JSON.parse(settingsSchemaObj[0].settings))});
    }

    catch(error){
        res.json({error: modifyError(error)});
    }
})


router.put('/updateSettings', auth, async (req, res) => {
    const Settings = require('../models/Settings')(req.headers.origin);
     
    function SettingsMsg(isSuccess, result) {
        this.isSuccess = isSuccess; 
        if(isSuccess) {
            this.updatedSettings = result;
        }
        if(!isSuccess) {
            this.failureMsg = result;
        }
    }

    
    try {
        const settings = JSON.stringify(req.body.settings);

        /* const newSettings = new Settings({settings: settings});
        const savedSettings = await newSettings.save();
        console.log(savedSettings); */

        if(!req.body.settings || settings.length > 100000) {
            return res.json({settingsMsg: new SettingsMsg(false, "False settings data")});
        }

        const updatedSchemaObj = await Settings.findOneAndUpdate({}, {settings: settings}, {new: true});
    
        return res.json({settingsMsg: new SettingsMsg(true, JSON.parse(updatedSchemaObj.settings))});
    }
    catch(error){
        res.json({error: modifyError(error)});
    }
})

module.exports = router; 
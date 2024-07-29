const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = function(app) {
    app.use(cookieParser());
    app.use(express.json({
        type: ['application/json', 'text/plain'],
        limit: '50mb'
    }));
    /* app.use(express.urlencoded({extended: true})); */
}
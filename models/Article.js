const mongoose = require('mongoose');
const Joi = require('joi');
const { boolean } = require('joi');
const config = require('config');

const articleSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    supertitle: {
        type: String,
        required: false
    },
    subtitle: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    paragraphs: {
        type: Array
    }, 
    imgURL: {
        type: String,
        required: true
    },
    imgName: {
        type: String,
        required: true
    },
    imgURL2: {
        type: String,
        required: true
    },
    imgName2: {
        type: String,
        required: true
    },
    imgFilter: {
        type: Array
    },
    imgFilter2: {
        type: Array
    },
    videoURL: {
        type: String,
        default: 'none'
    },
    videoName: {
        type: String, 
        default: 'none'
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        required: true
    },
    dateUpdated: {
        type: Date,
        default: Date.now(),
        required: true
    },
    datePublished: {
        type: Date, 
        default: Date.now(), 
        required: true
    }, 
    videoDescription: {
        type: String,
        default: 'none'
    },
    imgDescription: {
        type: String,
        default: 'none'  
    },
    source: {
        type: String
    },
    author: {
        type: String
    }, 
    tagsArr: {
        type: Array
    }

})

const copies = config.get('copies').split(' ');

module.exports = function createModel(origin) {

    let articleSuffix;

    copies.forEach((copy, i) => {
        console.log(origin);
        console.log(copy);
        console.log(articleSuffix);
        if(origin.includes('localhost')) {
            articleSuffix = '';
            return;
        }
        if(origin.includes(copy)) {
            articleSuffix = copy;
            if(copy == '0') articleSuffix == '';
        } else {
            articleSuffix = '';
        }
        
    })
    console.log(articleSuffix);
    
    return mongoose.model(`Article${articleSuffix}`, articleSchema);
}

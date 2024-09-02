const express = require('express');
const router = express.Router();
const config = require('config');
let copies = config.get('copies').split(' ');
copies.push('0');

router.get('/initial/:type/:from/:to/', async (req, res) => {
    
    let type = req.params.type;
    if((type != 'art') && (type != 'set') && (type != 'all')) return res.json('incorrect type of initial'); 
    let from = req.params.from;
    if(!copies.some(elem => (elem == from))) return res.json('incorrect name of copy'); 
    let to = req.params.to;
    if(to == '0')return res.json('0 copy can not be changed');
    if(!copies.some(elem => (elem == to))) return res.json('incorrect name of copy'); 

    if((type == 'set')) {
        const suffixFrom = from == '0'? '' : from;
        const suffixTo = to == '0'? '' : to;
        const SettingsFrom = require('../models/Settings')(suffixFrom);
        const SettingsTo = require('../models/Settings')(suffixTo);

        const findResult = await SettingsFrom.find();
        const settingsFrom = findResult[0].settings;
        const result = await new SettingsTo({settings: settingsFrom}).save();
        const savedSettings = await SettingsTo.find();
        return res.json({savedSettings: savedSettings[0]});
    }

    if(type == 'art') {

        const suffixFrom = from == '0'? '' : from;
        const suffixTo = to == '0'? '' : to;
        const ArticleFrom = require('../models/Article')(suffixFrom);
        const ArticleTo = require('../models/Article')(suffixTo);

        const articlesFrom = await ArticleFrom.find() /* .find({dateCreated: {$gte:  new Date("2024, 8, 3")}}) */

        articlesFrom.forEach(async (article, i) => {

            const copyArticle = new ArticleTo({
                category: article.category,
                published: article.published,
                position: article.position,
                title: article.title,
                supertitle: article.supertitle,
                subtitle: article.subtitle,
                text: article.text,
                paragraphs: article.paragraphs,
                imgURL: article.imgURL /* 'generic' */,
                imgName: article.imgName /* 'generic' */,
                imgURL2: article.imgURL2 /* 'generic' */,
                imgName2: article.imgName2 /* 'generic' */,
                imgFilter: article.imgFilter,
                imgFilter2: article.imgFilter2,
                videoURL: article.videoURL /* 'none' */,
                videoName: article.videoName /* 'none' */,
                dateCreated: article.dateCreated,
                dateUpdated: article.dateUpdated,
                datePublished: article.datePublished, 
                imgDescription: article.imgDescription /* '' */, 
                videoDescription: article.videoDescription /* 'none' */, 
                source: article.source,
                author: article.author,
                tagsArr: article.tagsArr, 
                note: article.note
            })
            let savedArticle = await copyArticle.save();
    
        })
        const savedArticles = await ArticleTo.find();
        return res.json({savedArticles: savedArticles});
    }

    if(type == 'all') {
        const suffixFrom = from == '0'? '' : from;
        const suffixTo = to == '0'? '' : to;

        const SettingsFrom = require('../models/Settings')(suffixFrom);
        const SettingsTo = require('../models/Settings')(suffixTo);

        const ArticleFrom = require('../models/Article')(suffixFrom);
        const ArticleTo = require('../models/Article')(suffixTo);

        const findResult = await SettingsFrom.find();
        const settingsFrom = findResult[0].settings;
        const articlesFrom = await ArticleFrom.find() /* .find({dateCreated: {$gte:  new Date("2024, 8, 3")}}) */

        const result = await new SettingsTo({settings: settingsFrom}).save();
        articlesFrom.forEach(async (article, i) => {
            const copyArticle = new ArticleTo({
                category: article.category,
                published: article.published,
                position: article.position,
                title: article.title,
                supertitle: article.supertitle,
                subtitle: article.subtitle,
                text: article.text,
                paragraphs: article.paragraphs,
                imgURL: article.imgURL /* 'generic' */,
                imgName: article.imgName /* 'generic' */,
                imgURL2: article.imgURL2 /* 'generic' */,
                imgName2: article.imgName2 /* 'generic' */,
                imgFilter: article.imgFilter,
                imgFilter2: article.imgFilter2,
                videoURL: article.videoURL /* 'none' */,
                videoName: article.videoName /* 'none' */,
                dateCreated: article.dateCreated,
                dateUpdated: article.dateUpdated,
                datePublished: article.datePublished, 
                imgDescription: article.imgDescription /* '' */, 
                videoDescription: article.videoDescription /* 'none' */, 
                source: article.source,
                author: article.author,
                tagsArr: article.tagsArr, 
                note: article.note
            })
            let savedArticle = await copyArticle.save();
        })

        const savedSettings = await SettingsTo.find();
        const savedArticles = await ArticleTo.find();

        return res.json({savedData: {
            savedSettings: savedSettings[0],
            savedArticles: savedArticles
        }})
    }

})


router.get('/clear/:type/:copy', async (req, res) => {
    
    let type = req.params.type;
    if((type != 'art') && (type != 'set') && (type != 'all')) return res.json('incorrect type of initial'); 

    let copy = req.params.copy;
    if(!copies.some(elem => (elem == copy))) return res.json('incorrect name of copy');
    if(copy == '0')return res.json('0 copy can not be changed');

    async function emptyCollection(Model) {
        const deleteMsg = await Model.deleteMany();
        return {deleteMsg: {
            deleteMsg: deleteMsg
        }}
    }

    if(type == 'set') {
        const Settings = require('../models/Settings')(copy);
        return res.json({deleteMsg: await emptyCollection(Settings)});
    }

    if(type == 'art') {
        const Article = require('../models/Article')(copy);
        return res.json({deleteMsg: await emptyCollection(Article)});
    }
    if(type == 'all') {
        const Article = require('../models/Article')(copy);
        const Settings = require('../models/Settings')(copy);
        return res.json({deleteMsg: {
            deletedSettings: await emptyCollection(Settings),
            deletedArticles: await emptyCollection(Article)
        }});
    }
})

router.get('/check/:copy', async (req, res) => {
   
    let copy = req.params.copy;
    if(!copies.some(elem => (elem == copy))) return res.json('incorrect name of copy');

    const Article = require('../models/Article')(copy);
    const Settings = require('../models/Settings')(copy);
    
    return res.json({checkMsg: {
        settings: await Settings.find(),
        articles: await Article.find()
    }});

})

module.exports = router;
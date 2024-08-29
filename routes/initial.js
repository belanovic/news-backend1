const express = require('express');
const router = express.Router();
const config = require('config');

router.get('/initial/:id', async (req, res) => {


    let id = req.params.id;

    if(id == 'check') return res.json(await check());
    
    let deleteOperation = false;

    if(id.includes('delete')) {
        id = id.replace('delete', '');
        deleteOperation = true;
    }

    const copies = config.get('copies').split(' ');

    if(!copies.some(copy => (copy == id))) return res.json({savedArticlesSettings: []}); 

    const Article = require('../models/Article')('');
    const Settings1 = require('../models/Settings')('1');
    const ArticleX = require('../models/Article')(id);
    const SettingsX = require('../models/Settings')(id);

    async function check() {
        const Article = require('../models/Article')('');
        const Settings1 = require('../models/Settings')('1');
        const articles = await Article.find();
        const settings1 = await Settings1.find();
        return {data: {
            articles: articles,
            settings1: settings1
        }}
    }

    
    async function emptyCollection(ModelArticle, ModelSettings) {
        const deleteMsgArticle = await ModelArticle.deleteMany();
        const deleteMsgSettings = await ModelSettings.deleteMany();
        return {deleteMsg: {
            deleteMsgArticle: deleteMsgArticle,
            deleteMsgSettings: deleteMsgSettings
        }}
    }
    if(deleteOperation)return res.json({deleteMsg: await emptyCollection(ArticleX, SettingsX)});

    const settings1 = await Settings1.find();
    const defaultSettings = settings1[0].settings;
    const resultX = await new SettingsX({settings: defaultSettings}).save();

    
    const articles = await Article
            .find()
            /* .find({dateCreated: {$gte:  new Date("2024, 8, 3")}}) */
 
    articles.forEach(async (article, i) => {

        const copyArticle = new ArticleX({
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
        /* copyArticle.push(savedArticle); */
        /* copyArticle.push(article.title);  */

    })
    const savedArticles = await ArticleX.find();
    const savedSettings = await SettingsX.find();
        
    return res.json({savedData: {
        savedArticles: savedArticles,
        savedSettings: savedSettings[0]
    }});
})

module.exports = router;
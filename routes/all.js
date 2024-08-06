const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const ArticleX = require('../models/ArticleX');


router.get('/all', async (req, res) => {

    const allArticles = await Article
            .find({dateCreated: {$gte:  new Date("2024, 8, 3")}})
 
    let allNewArticles = [];

    allArticles.forEach(async(article, i) => {

        const newArticle = new ArticleX({
            category: article.category,
            published: article.published,
            position: article.position,
            title: article.title,
            supertitle: article.supertitle,
            subtitle: article.subtitle,
            text: article.text,
            paragraphs: article.paragraphs,
            imgURL: 'generic',
            imgName: 'generic',
            imgURL2: 'generic',
            imgName2: 'generic',
            imgFilter: article.imgFilter,
            imgFilter2: article.imgFilter2,
            videoURL: 'none',
            videoName: 'none',
            dateCreated: article.dateCreated,
            dateUpdated: article.dateUpdated,
            datePublished: article.datePublished, 
            imgDescription: '', 
            videoDescription: 'none', 
            source: article.source,
            author: article.author,
            tagsArr: article.tagsArr, 
            note: article.note
        })
        /* const savedArticle = await newArticle.save();
        allNewArticles.push(savedArticle); */
        /* allNewArticles.push(article.title);  */
    })
  
    return res.json({allNewArticles: allNewArticles});
})

module.exports = router;
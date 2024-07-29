const mongoose = require('mongoose');

module.exports = function() {

    
    const mongoAddress1 = `mongodb://localhost/news`;
    const mongoAddress2 = `mongodb+srv://goranbelanovic:1234@cluster0.xneom.mongodb.net/news?retryWrites=true&w=majority`;

    
    mongoose.connect(mongoAddress2)
        .then(() => console.log('Connected to the news database'))
        .catch(error => console.log(error.message))
}
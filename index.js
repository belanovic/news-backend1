const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const config = require('config');

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1); 
} 

require('./startup/headers')(app);
require('./startup/parsers')(app);
require('./startup/routers')(app);

app.get('/n', (req, res) => {
    res.send('proba uspela')
    res.end()
})
process.env.TZ = "Europe/Belgrade";
const hostIP = config.get('hostIP');
const port = process.env.PORT || 4000; 

server.listen(port, hostIP, () => console.log(`Server is listening on port ${port}`));


require('./startup/db')();
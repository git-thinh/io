const port = 57936;
const express = require('express');
const server = express();
server.configure(function () {
    server.use('/media', express.static(__dirname + '/media'));
    server.use(express.static(__dirname + '/public'));
});

server.listen(3000);
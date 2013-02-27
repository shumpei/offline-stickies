"use strict";

var express = require('express');
var app = express();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  express.static.mime.define({ 'text/cache-manifest': ['manifest', 'appcache'] });
  app.use(express['static'](__dirname + '/public'));
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
});

var memos = {};
app.get('/memos', function(req, res) {
    console.log('get');
    res.json(memos);
});
app.post('/memos', function(req, res) {
    console.log('post');
    memos = req.body;
    res.send(200);
});

app.listen(process.env.PORT || 2000);

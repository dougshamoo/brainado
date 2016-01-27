var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('superagent');

var twinwordKey;
var twinwordURL = 'https://twinword-word-associations-v1.p.mashape.com/associations/';

if (process.env.TWINWORD_KEY) {
  twinwordKey = process.env.TWINWORD_KEY;
} else {
  twinwordKey = require('./config.js').twinword.key;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})); 

app.use(express.static(__dirname + '/../public'));

app.post('/word', function(req, res) {
  var word = req.body.word;
  console.log(word);
  request.post(twinwordURL)
    .set({
      'X-Mashape-Key': twinwordKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    })
    .send('entry=' + word)
    .end(function(err, data) {
      if (err || !data.ok) {
        console.log(err);
      } else {
        console.log(data.body);
        res.status(200).json(data.body);
      }
    });

});

module.exports = app;

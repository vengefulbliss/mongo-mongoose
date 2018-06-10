// Dependencies
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongojs = require('mongojs');
var app     = express();

// static folder
app.use(express.static('public'));

// Database setup
var databaseUrl = 'scraper';
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('database error: ', err )
});

// ROUTES
// ========================================

//main route sends to index
app.get('/', function(req, res) {
  res.send(index.html);
});

// gets scraped data and sends to browser in json format
app.get('/all', function(req, res){
  db.scrapedData.find({}, function(err, found) {
    if (err) {
      console.log(err);
    } else {
      res.json(found);
    }
  });
});

// web scraping route that takes data from a site and places it in mongodb
app.get('/scrape', function(req, res) {
  request('https://www.cnet.com/news/', function(error, response, html){
    var $ = cheerio.load(html);
    $('.title').each(function(i, element) {
      var title = $(this).children('a').text();
      var link = $(this).children('a').attr('href');
      if(title && link) {
        db.scrapedData.save({
          title: title,
          link: link
        },
        function(err, saved) {
          if (err) {
            console.log(err);
          } else {
            console.log(saved);
          }
        });
      }
    });
  });
    res.send('Scrape Complete');
  });

  // route for submitting comments
  app.post('/submit', function(req, res) {
    console.log(req.body);
    // create and insert comments collection for mongodb
    db.comments.insert(req.body, function(err, saved) {
      if (err) {
        console.log(err);
      }
      else{
        res.send(saved);
      }
    });
  });

  app.listen('3000', function() {
    console.log('App running on port 3000');
  });
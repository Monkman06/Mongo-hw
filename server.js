var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
// Notice: Our scraping tools are prepared, too
var request = require('request'); 
var cheerio = require('cheerio');
// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));

// Database configuration with mongoose
mongoose.connect('mongodb://heroku_vtlb7r91:lnr02obarb4tjj6vrvls1r4fvb@ds127998.mlab.com:27998/heroku_vtlb7r91');
var db = mongoose.connection;
// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});
// And we bring in our Note and Article models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// Routes
app.get('/', function(req, res) {
  res.send(index.html);
});

// A GET request to scrape the onion website.
app.get('/scrape', function(req, res) {
	// first, we grab the body of the html with request
  request('http://www.theonion.com/', function(error, response, html) {
  	// then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // now, we grab every h2 within an article tag, and do the following:
    $('article h2').each(function(i, element) {

    		// save an empty result object
				var result = {};
				// add the text and href of every link, 
				// and save them as properties of the result obj
				result.title = $(this).children('a').text();
				result.link = $(this).children('a').attr('href');
				result.excerpt = $(this).parent().siblings('p.excert').text();

				var entry = new Article (result);
				// now, save that entry to the db
				entry.save(function(err, doc) {
				  if (err) {
				    console.log(err);
				  } 
				  else {
				    console.log(doc);
				  }
				});
    });
  });
  // tell the browser that we finished scraping the text.
  res.send("Scrape Complete");
});
app.get('/articles', function(req, res){	// this will get the articles we scraped from the mongoDB// grab every doc in the Articles array
	Article.find({}, function(err, doc){
		if (err){// log any errors
			console.log(err);
		} 
		else {// or send the doc to the browser as a json object
			res.json(doc);
		}
	});
});
app.get('/articles/:id', function(req, res){// grab an article by it's ObjectId
	// using the id passed in the id parameter,prepare a query that finds the matching one in our db...
	Article.findOne({'_id': req.params.id})
	.populate('note')// and populate all of the notes associated with it.
	.exec(function(err, doc){// now, execute our query
		if (err){// log any errors
			console.log(err);
		} 
		else {// otherwise, send the doc to the browser as a json object
			res.json(doc);
		}
	});
});
// replace the existing note of an article with a new 1 or if no note exists for an article, make the posted note it's note.
app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);// create a new note and pass the req.body to the entry.
	newNote.save(function(err, doc){// and save the new note the db
		if(err){// log any errors
			console.log(err);
		} 
		// otherwise
		else {// using the Article id passed in the id parameter of our url, prepare a query that finds the matching Article in our db
			// and update it to make it's lone note the one we just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});
// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
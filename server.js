// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var newsscraperRoute = require("./controller/newscrapper_controller.js");

// Initialize Express
var app = express();
var port = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// HandleBars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
// Database configuration
// var databaseUrl = "scraper";
// var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/techcrunchscraper", {
  useMongoClient: true
});

//ROUTES
// Root
app.get("/", function(req, res) {
    console.log("get");
        res.render("index");
    });


// Scraping
// app.get("/scrape", function(req,res){
//   axios.get("https://techcrunch.com/"), function(error, response, html){
//     var $ = cheerio.load(html);
//     console.log(html);
//     $(".block-content").each(function(i,element){
//       var result = {};
//       result.title = $(this)
//         .children("h2.post-title")
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("h2.post-title")
//         .children("a")
//         .attr("href");
//       result.excerpt = $(this)
//       .children("p.excerpt")
//       .html();

//       db.Article
//       .create(result)
//       .then(function(dbArticle){
//         res.send("Scrape Complete");
//       })
//       .catch(function(err){
//         res.json(err);
//       });
//     });  
//   };
// });

app.get("/scrape", function(req, res){
    console.log("ScrapeRoot: Get");
    request("https://techcrunch.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        $("h2.post-title").each(function(i,element){
          console.log("Hello");
          var title = $(element).text();
          var link = $(element).children().attr("href");
          db.Article.create({
            "title": title, 
            "link": link
          });
        });
      });
    res.render("index");
});






// Get all articles

app.get("/articles", function(req, res) {
  db.Article
  .find({})
  .then(function(dbArticle) {
    res.json(dbArticle);
  });
});

// Saved articles
app.post("/saved", function(req, res) {
  db.Article
  .create(req.body)
  .then(function(dbArticle) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Article with Note
app.get("/articles/:id", function(req, res) {
  db.Article
  .findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

//Routes for saving & updating an article with associated Note
app.post("/articles/:id", function(req, res) {
  db.Note
  .create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Starts the server to begin listening
// =============================================================
app.listen(port, function() {
  console.log("App listening on PORT " + port);
});
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

app.get("/scrape", function(req, res){
    console.log("ScrapeRoot: Get");
    request("https://techcrunch.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        var articles = [];
        $(".block-content").each(function(i,element){
        // $("h2.post-title").each(function(i,element){
          console.log("Hello");
          console.log(element);
          var title = 
          $(element)
            .children("h2.post-title")
            .children("a")
            .text();
          var link = $(element)
          // .children().attr("href");
          .children("h2.post-title")
          .children("a")
          .attr("href");

          var excerpt = $(element)
          .children("p.excerpt")
          .text();

          articles[i] = {
            title: title,
            link: link,
            excerpt:excerpt
          };

          db.Article.create({
            "title": title, 
            "link": link,
            "saved": false,
            "excerpt": excerpt
          }).then(function(dbArticle){
            // res.send("Scrape Complete");
            console.log(dbArticle);
            articles[i]._id = dbArticle._id;
          })
          .catch(function(err){
            console.log(err);
          });
        });
        // console.log(articles);
        res.render("index", {articles: articles});
      });
    
});


// Saved articles
app.post("/saved", function(req, res) {
  db.Article.findOneAndUpdate({_id: req.body._id},{$set:{saved:true}})
  .then(function(dbArticle) {
    console.log(dbArticle);
    return res.send("Article Saved")
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Article with Note
app.post("/savenote", function(req, res) {
  var newNote = {
    note: req.body.text
  };
  db.Article.update({_id: req.body._id},{$push:{notes:newNote}},function(error, docs){
    if(error){
      console.log
    }
    console.log(docs);
  })
  
});

//Routes for saving & updating an article with associated Note
app.get("/articles", function(req, res) {
  db.Article
    .find({saved:true})
    .then(function(dbArticle){
      res.render("savedArticles",{articles:dbArticle})
    })
});

// Delete articles
app.post("/deleteArticles", function(req, res) {
  db.Article.findOneAndUpdate({_id: req.body._id},{$set:{saved:false}})
  .then(function(dbArticle) {
    return res.redirect("/articles");
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
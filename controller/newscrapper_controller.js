var express = require('express');
var router = express.Router();
var path = require('path');

// main route
router.route("/")
    .get(function(req, res) {
        console.log("get");
            res.render("index");
        });
// Scrape Button Route
router.route("/scrape")
    .get(function(req, res){
        console.log("ScrapeRoot: Get");
        request("https://techcrunch.com/", function(error, response, html) {
            var $ = cheerio.load(html);
            $("h2.post-title").each(function(i,element){
              var title = $(element).text();
              var link = $(element).children().attr("href");
              db.scrapedData.insert({
                "title": title, 
                "link": link
              });
            });
          });
        res.render("index", {scraped: data});
    });
router.route("/savedarticles")
.get(function(req,res){
    console.log("Saved: GET");
    res.render("savedArticles");
});

module.exports = router;
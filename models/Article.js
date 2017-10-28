var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NoteSchema = new Schema ({note: String});

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    notes:
        [NoteSchema],
    saved:{
        type: Boolean,
        default: false,
        required: true
    },
    excerpt:{
        type: String,
        required: true
    }
    });

    var Article = mongoose.model("Article", ArticleSchema);
    module.exports = Article;
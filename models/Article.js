// Require mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;// Create Schema class

// Create article schema
var ArticleSchema = new Schema({
  title: {// title is a required string
    type: String,
    unique: true
    require: "Article title is required"
  },
  link: {// link is a required string
    type: String,
    required: true
  },
  note: { // This only saves one note's ObjectId, ref refers to the Note model
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);// Create Article model with ArticleSchema
module.exports = Article;// Export the model
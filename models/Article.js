// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is required
   title: {
   type:String,
   unique: true,
  required:"article title is required"
},
link: {
 type:String,
   unique: true,
  required:"article title is required"
},
  excerpt: {
    type:String,
    unique:true
  },
  // link is required
  created: {
    type:Date,
    default:Date.now
  },
  // this only saves one note's ObjectId. ref refers to the Note model.
  note: {
      type: Schema.Types.ObjectId,
      ref: 'Note'
  }
});
// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;

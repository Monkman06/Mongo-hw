var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({// create the Note schema
  // just a string
  title: {
    type:String
   // required: 
  },
  // just a string
  body: {
    type:String
   // required: 
  }
});
// Remember, Mongoose will auto save the notes ObjectIds. ids are referred to in the Article model. create the Note model with the NoteSchema
var Note = mongoose.model('Note', NoteSchema);
module.exports = Note;

var mongoose = require('mongoose');  
var ngoSchema = new mongoose.Schema({  
  name: String,
  country: String,
  establishedOn: { type: Date, default: Date.now },
  website: String,
  workingArea: String
});
mongoose.model('Ngo', ngoSchema);
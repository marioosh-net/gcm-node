var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RegSchema = new Schema({
  regid: String,
  name: String
});

mongoose.model('Reg', RegSchema);
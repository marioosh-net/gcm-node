var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RegSchema = new Schema({
  regid: String
});

mongoose.model('Reg', RegSchema);
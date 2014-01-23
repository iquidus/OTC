var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
 
var OrderSchema = new Schema({
  nick: { type: String, required: true },
  bid: {type: Boolean, default: false },
  quantity: {type: String, default: "1" },
  price: { type: String, default: "1" },
});

module.exports = mongoose.model('Order', OrderSchema);
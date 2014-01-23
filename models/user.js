var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
 
var UserSchema = new Schema({
  nick: { type: String, required: true, index: { unique: true } },
  admin: {type: Boolean, default: false },
  escrow: {type: Boolean, default: false },
  btc: { type: String, default: "[not set]" },
  alt: { type: String, default: "[not set]" },
  online: {type: Boolean, default: false}
});

UserSchema.static('getUserByNick', function(nick, cb) {
  this.findOne({nick: nick}, function(err, user) {
    if(user) {
      return cb(user);
    } else {
      return cb();
    }
  });
});

UserSchema.static('exists', function(nick, cb) {
  this.getUserByNick(nick, function(user) {
    if(user) {
      return cb(true);
    } else {
      return cb(false);
    }
  });
});

UserSchema.static('admin', function(nick, cb) {
  this.getUserByNick(nick, function(user) {
    if(user.admin) {
      return cb(true);
    } else {
      return cb(false);
    }
  });
});

module.exports = mongoose.model('User', UserSchema);
var mongoose = require('mongoose')
  , User = require('../models/user')
  , Order = require('../models/order');

module.exports = {

  // initialize DB
  connect: function(database, cb) {
    mongoose.connect(database, function(err) {
      if (err) {
        console.log('Unable to connect to database: %s', database);
        console.log('Aborting');
        process.exit(1);

      }
      console.log('Successfully connected to MongoDB');
      return cb();
    });
  },
  
  create_user: function(nick, cb){    
    var newUser = new User({
      nick: nick,
    });

    newUser.save(function(err) {
      if (err) {
        console.log(err);
        return cb();
      } else {
        console.log("user account created: %s", nick);
        console.log(newUser);
        return cb();
      }
    });
  },

  create_order: function(nick, bid, quantity, price, cb){ 
    var newOrder = new Order({
      nick: nick,
      bid: bid,
      quantity: quantity,
      price: price,
    });

    newOrder.save(function(err) {
      if (err) {
        console.log(err);
        return cb();
      } else {
        console.log("order created");
        console.log(newOrder);
        return cb();
      }
    });
  },

  rmOrder: function(nick, bid) {
    Order.find({nick: nick, bid: bid}).remove();
  },

  setAdmin: function(nick, state) {
    User.update({nick: nick}, {admin: state}, function() {
      console.log("%s: admin status changed to %s", nick, state);
    });
  },

  setEscrow: function(nick, state) {
    User.update({nick: nick}, {escrow: state}, function() {
      console.log("%s: escrow status changed to %s", nick, state);
    });
  },

  setOnline: function(nick, state) {
    User.update({nick: nick}, {online: state}, function() {
      console.log("%s: online status changed to %s", nick, state);
    });
  },

  setBTC: function(nick, address) {
    User.update({nick: nick}, {btc: address}, function() {
      console.log("%s: BTC address changed to %s", nick, address);
    });
  },

  setALT: function(nick, alt, address) {
    User.update({nick: nick}, {alt: address}, function() {
      console.log("%s: %s address changed to %s", nick, alt, address);
    });
  },

  getUsers: function(cb) {
    User.find({}, function (err, users) {
        return cb(users);
    });
  },

  getBids: function(cb) {
    Order.find({bid: true}, function (err, orders) {
        return cb(orders);
    });
  },

  getAsks: function(cb) {
    Order.find({bid: false}, function (err, orders) {
        return cb(orders);
    });
  },

  getAdmins: function(cb) {
   User.find({admin: true}, function (err, users) {
      return cb(users);
    });
  },

  getEscrows: function(cb) {
    User.find({escrow: true}, function (err, users) {
      return cb(users);
    });
  },

  rmUser: function(user) {
    User.remove({nick: user}, function() {
      console.log('%s: deleted', user);
    });
  }
};

var strsplit = require("strsplit");

function list_online(bot, channel, list, count) {
  if (count < list.length) {
      if (list[count].online == true) {
        bot.say(channel, list[count].nick);
      }
      count = count + 1;
    } else {
      return;
    }
    list_online(bot, channel, list, count);
}

function list_orders(bot, user, list, count) {
  if (count < list.length) {
    bot.say(user, list[count].quantity + "@" + list[count].price + " (" + list[count].nick + ")");
    count = count + 1;
  } else {
    return;
  }
  list_orders(bot, user, list, count);
}


function list_spread(bot, channel, asks, bids, count) {
  if (count < 3) {
    var s_bid = "                           ";
    var s_ask = "                           ";
    if (count < bids.length) {
    var bid = bids[count]; 
    var b_order = bid.quantity + "@" + bid.price;  
    var o_bid = String("            " + b_order).slice(-12);  
    var n_bid = String("              " + bid.nick).slice(-14);
    s_bid = o_bid + " " + n_bid;
    }
    if (count < asks.length) {
    var ask = asks[count];    
    var a_order = ask.quantity + "@" + ask.price;
    var o_ask = String("            " + a_order).slice(-12);   
    var n_ask = String("              " + ask.nick).slice(-14);
    s_ask = o_ask + " " + n_ask;
    }

    count = count + 1;
    bot.say(channel, count + ".  " + s_bid + " | " + count + ".  " + s_ask);
  } else {
    return;
  }
  list_spread(bot, channel, asks, bids, count);
}


function sortOrders(orders, bid, cb) {
  orders.sort(function(a, b){
    if (bid == true) {
      return b.price-a.price
    } else {
      return a.price-b.price
    }
  });

  return cb(orders);
}

module.exports = {
  parse_text: function(text, cb) {
    var split = strsplit(text, /\s+/);
    return cb(split[0], split[1]);
  },

  parse_order: function(order, cb) {
    var split = strsplit(order, /@+/);
    return cb(split[0], split[1]);
  },

  list_admins: function(bot, channel, admins) {
    list_online(bot, channel, admins, 0);
  },

  list_escrows: function(bot, channel, escrows) {
    list_online(bot, channel, escrows, 0);
  },

  list_bids: function(bot, user, bids) {
    sortOrders(bids, true, function(sorted){
      list_orders(bot, user, bids, 0);
    });
  },

  list_asks: function(bot, user, asks) {
    sortOrders(asks, false, function(sorted){
      list_orders(bot, user, asks, 0);
    });
  },

  spread: function(bot, channel, asks, bids) {
    bot.say(channel, "BIDS                            | ASKS");
    sortOrders(asks, false, function(s_asks){
      sortOrders(bids, true, function(s_bids){
        list_spread(bot, channel, s_asks, s_bids, 0);
      });
    });
  }
}
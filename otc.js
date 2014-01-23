var irc = require("irc")
  , config = require("./lib/settings")
  , db = require("./lib/database")
  , lib = require("./lib/libotc")
  , User = require("./models/user");

var info = "iquidus-otc\n" 
  + "version: " + "1.0\n"  
  + "source : https://github.com/iquidus/OTC\n" 
  + "donate : \n"
  + "BTC: 14EWdpqFx75N3F9EwtYdnbQnHTPFEUmWZt\n"
  + "LTC: LfDxv8K9Nz63ifibVhXXZs3iKgbUsYQXBS\n"
  + "MEC: MVPt7YHFYPLKZptgNDizEnS74CCF973e1w\n"
  + "EAC: eg1R4KzqeAaV6YkAebsHSxwVRYDhK9HXQi\n"
  + "GLB: 1JYf2ecLY3mTgydjS2CBzhHU2HgB7G9GzM\n"
  + "DGB: DPBV8siqomQ9icuAJ2ev2mgs8ZbKDmP8x8\n"
  + "KOI: 5e6RXK5jYWUNNChfhiLsdhJv6AgdokmpZX (coye)\n";

var altcoin = { 
  lName: config.altcoin.toLowerCase(),
  uName: config.altcoin.toUpperCase(),
  get: "!get" + config.altcoin.toLowerCase(),
  set: "!set" + config.altcoin.toLowerCase()
}

var help = 
  + "Orders must be in the format of AMOUNT_OF_COINS@PRICE_EACH e.g 100K@30\n" 
  + config.name + " usage:\n"
  + "!hello : register your nick with the bot\n"
  + "!bid ORDER : place bid e.g !bid 1.5m@25\n"
  + "!ask ORDER : place ask e.g !ask 1.5m@20\n"
  + "!unbid : remove active bid\n"
  + "!unask : remove active ask\n"
  + "!bids : fetch all bids\n"
  + "!asks : fetch all asks\n"
  + "!spread : display spread.\n"
  + "!setbtc ADDRESS : set your btc address\n"
  + altcoin.set + " ADDRESS : set your " + altcoin.uName + " address\n"
  + "!getbtc NICK : display a users btc address\n"
  + altcoin.get + " NICK : display a users " + altcoin.uName + " address\n"
  + "!admins : display bot administrators\n"
  + "!escrows : display approved escrows\n"
  + "!help : fetch this help message.\n"
  + "!info : display bot information\n"; 

var help_admin = "\nADMIN COMMANDS:\n"
  + "!hello : changes your status to online\n"
  + "!bye : changes your status to offline\n"
  + "!rmbid USER : remove users active bid\n"
  + "!rmask USER : remove users active ask\n"
  + "!addadmin USER : make user a bot adimnistrator\n"
  + "!rmadmin USER : remove admin status from user\n"
  + "!addescrow USER : add user to approved escrows\n"
  + "!rmescrow USER : remove user from approved escrows";

// Connect to database
var dbString = "mongodb://" + config.database.address;
dbString = dbString + ":" + config.database.port;
dbString = dbString + "/" + config.database.name;

db.connect(dbString, function() {
  // Add owner to database if not present. 
  User.exists(config.owner, function(exists){
    if (exists == false) {
      db.create_user(config.owner, function(){
        db.setAdmin(config.owner, true);
      });
    }
  });

  // Start bot
  console.log("Connecting to " + config.server);
  var bot = new irc.Client(config.server, config.name, {
    port: config.port,
    secure: config.secure,
    selfSigned: config.selfSigned,
    certExpired: config.certExpired,
    channels: config.channels,
    userName: config.name,
    realName: 'iquidus-otc',
    autoRejoin: true,
    floodProtection: true,
    floodProtectionDelay: 750,
  });

  // Listen for joins
  bot.addListener("join", function(channel, who) {
    if (who == config.name) {
      console.log("Channel joined: " + channel);
    }
    if (who == config.owner) {
      bot.say(channel, "Welcome " + who);
    };  
  });

  // Listen for any message
  bot.addListener("message", function(from, to, text, message) {
    lib.parse_text(text, function(command, options){
      switch(command){
        case '!help': bot.say(from, help);
          User.admin(from, function(admin){
            if (admin == true) {
              bot.say(from, help_admin);
            }
          });
          break;
        case '!spread': 
          db.getBids(function(bids){
            db.getAsks(function(asks){
              lib.spread(bot, to, asks, bids);
            });
          });
          break;
        case '!bid': 
          db.rmOrder(from, true);
          lib.parse_order(options, function(quantity, price) {
            db.create_order(from, true, quantity, price, function(){
              bot.say(from, "your bid for " + quantity + " " + altcoin.uName +" at " + price + " satoshi(s) each has been placed.");
            });
          });
          break;
        case '!unbid': db.rmOrder(from, true);
          break;
        case '!ask': 
          db.rmOrder(from, false);
          lib.parse_order(options, function(quantity, price) {
            db.create_order(from, false, quantity, price, function(){
              bot.say(from, "your ask for " + quantity + " " + altcoin.uName +" at " + price + " satoshi(s) each has been placed.");
            });
          });
          break;
        case '!unask': db.rmOrder(from, false);
          break;
        case '!escrows': 
          db.getEscrows(function(escrows){
            lib.list_escrows(bot, to, escrows);
          });
          break;
        case '!admins': 
          db.getAdmins(function(admins){
            lib.list_admins(bot, to, admins);
          });
          break;            
        case '!bids':
          bot.say(from, "current buy orders (bids)"); 
          db.getBids(function(bids){
            lib.list_bids(bot, from, bids);
          });
          break;
        case '!asks': 
          bot.say(from, "current sell orders (asks)");
          db.getAsks(function(asks){
            lib.list_asks(bot, from, asks);
          });
          break;
        case altcoin.set: db.setALT(from, altcoin.uName, options);
          bot.say(from, altcoin.uName + " address updated: " + options);
          break;
        case '!setbtc': db.setBTC(from, options);
          bot.say(from, "BTC address updated: " + options);
          break;
        case '!getbtc': User.exists(options, function(exists){
          if (exists == true) {
            User.getUserByNick(options, function(user){
              if (user) {
                bot.say(to, "BTC: " + user.btc + " (" + user.nick + ")");
              }
            });
          }
        });
          break;  
        case altcoin.get: User.exists(options, function(exists){
          if (exists == true) {
            User.getUserByNick(options, function(user){
              if (user) {
                bot.say(to, altcoin.uName + ": " + user.alt + " (" + user.nick + ")");
              }
            });
          }
        });
          break;                      
        case '!addadmin':
          User.admin(from, function(admin){ 
            if ( admin == true ) {
              User.exists(options, function(exists){
                if (exists == true) {
                  db.setAdmin(options, true);
                }
              });
            }
          });
          break;  
        case '!addescrow':
          User.admin(from, function(admin){ 
            if ( admin == true ) {
              User.exists(options, function(exists){
                if (exists == true) {
                  db.setEscrow(options, true);
                }
              });
            }
          });
          break;           
        case '!rmadmin': 
          User.admin(from, function(admin){ 
            if ( admin == true ) {
              User.exists(options, function(exists){
                if (exists == true) {
                  if (options !== config.owner) {
                    db.setAdmin(options, false);
                  } else {
                    bot.say(from, "nice try...");
                  }
                }
              });
            }
          });
          break;
        case '!rmbid':
          User.admin(from, function(admin){ 
            if ( admin == true ) {
              User.exists(options, function(exists){
                if (exists == true) {
                  db.rmOrder(options, true);
                }
              });
            }
          });
          break;
        case '!rmask':
          User.admin(from, function(admin){ 
            if ( admin == true ) {
              User.exists(options, function(exists){
                if (exists == true) {
                  db.rmOrder(options, false);
                }
              });
            }
          });
          break;
        case '!rmescrow': 
          User.admin(from, function(admin){ 
            if ( admin == true ) {
              User.exists(options, function(exists){
                if (exists == true) {
                  if (options !== config.owner) {
                    db.setEscrow(options, false);
                  } else {
                    bot.say(from, "nice try...");
                  }
                }
              });
            }
          });
          break;                                    
        case '!info': bot.say(to, info);
          break;
        case '!hello': 
          User.exists(from, function(exists){
            if (exists == false) {
              db.create_user(from, function(){
                db.setOnline(from, true);
              });
            } else {
              db.setOnline(from, true);
            }
            bot.say(from, "hello!");
          });
          break;
        case '!bye': 
          db.setOnline(from, false);
          bot.say(from, "goodbye!");
          break;                               
        default:
          break;
      }
    });
  });
});
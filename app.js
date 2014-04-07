var express          = require('express');
var app              = express();
var server           = require('http').createServer(app);
var path             = require('path');
var _                = require('underscore');
var quoteFactory     = require('./modules/quotes.js');
var redisHelper      = require('./modules/redisFunctions.js');
var client           = redisHelper.client;
var config           = require('./config.js').config;
var mongoose         = require('mongoose').connect(config.mongoLabsUri);
var Schema           = mongoose.Schema;
// var passport         = require('passport');
// var LocalStrategy    = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy  = require('passport-twitter').Strategy;

// Temp redis error output
// This stops the server from bombing if we can't connect when we are in dev.
client.on("error", function (err) {
  console.log("error event - " + client.host + ":" + client.port + " - " + err);
});

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(require("connect-assets")());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  // parses json, x-www-form-urlencoded, and multipart/form-data
  app.use(express.bodyParser());
  // Support URL encoded bodies (re-check if I need this)
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  // parses request cookies, populating req.cookies and req.signedCookies
  // when the secret is passed, used for signing the cookies.
  app.use(express.cookieParser(config.cookieParserKey));
//   app.use(express.session({ secret: config.sessionSecret }));
//   app.use(passport.initialize());
//   app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'assets')));
});


//  _____             _            
// |  __ \           | |           
// | |__) |___  _   _| |_ ___  ___ 
// |  _  // _ \| | | | __/ _ \/ __|
// | | \ \ (_) | |_| | ||  __/\__ \
// |_|  \_\___/ \__,_|\__\___||___/
require('./routes')(app);

//   _____ _             _     _ _                 
//  / ____| |           | |   (_) |                
// | (___ | |_ __ _ _ __| |_   _| |_   _   _ _ __  
//  \___ \| __/ _` | '__| __| | | __| | | | | '_ \ 
//  ____) | || (_| | |  | |_  | | |_  | |_| | |_) |
// |_____/ \__\__,_|_|   \__| |_|\__|  \__,_| .__/ 
//                                          | |    
//                                          |_|    
var redisOutput = redisHelper.buildRedisDb();

// Skip starting the server up if we get redis errors.
if (redisOutput.err.length > 0) {
  console.log("".join(redisOutput.err));
} else {
  console.log("Redis commands executed with no errors - starting server.");
  server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
  });
}

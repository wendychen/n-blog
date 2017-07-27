var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');


var app = express();

// Set up the template engine
app.set('views', path.join(__dirname, 'views'));
// Set the template engine as ejs
app.set('view engine', 'ejs');

// Set up the path of static files directory
app.use(express.static(path.join(__dirname, 'public')));

// session middlewares
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb         // location of mongodb
    })
}));

// flash middlewares
app.use(flash());

app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),  // Upload files directory
    keepExtensions: true    // Keep the suffix
}));

// 设置模板全局常量
app.locals.site = {
  title: pkg.name,
  description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});
/*
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));
*/
// router
routes(app);
/*
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));
*/
// error page
app.use(function(err, req, res, next) {
    res.render('error', {
        error: err
    });
});

// Listen to the port, start the app
app.listen(config.port, function() {
    console.log(`${pkg.name} listening on port ${config.port}`);
});
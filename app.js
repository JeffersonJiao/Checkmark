const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const authRoutes = require('./routes/auth-route');
const homeRoutes = require('./routes/home-route');
const otherRoutes = require('./routes/other-route');
const chatRoutes = require('./routes/chat-route');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const socket = require('socket.io');
const socketEvents = require('./socketmodule/socketEvents');  
const app = express();

//set up view engine
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

//set up cookie session
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey],
}))
app.use(passport.initialize());
app.use(passport.session());

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//connect to mongoosedb

mongoose.connect(keys.mongoDB.dbURI,()=>{
    console.log('connected to db');
});
//Express session
app.use(session({
    secret: keys.session.Secret,
    resave: false,
    saveUninitialized: true,
  }));
// }))

//set up body parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


//set up validator
app.use(expressValidator({
    customValidators: {
        isEqual: (value1, value2) => {
          return value1 === value2
        }
      },
    errorFormatter:(param,msg,value)=>{
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// connect flash
app.use(flash());
///global var
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors = req.flash('errors');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.lists = "";
    next();
});

//create home route 
app.set('port',(process.env.PORT||3000));
app.use('/',homeRoutes);
app.use('/auth',authRoutes);
app.use('/chat',chatRoutes);
app.use('/other',otherRoutes);
var server = app.listen(app.get('port'),()=>{
    console.log('app is now listening');
});

var io = socket(server);

socketEvents(io);
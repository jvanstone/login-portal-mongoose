require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const path = require("path");

//GETS .ENV Variables 
var user_name = process.env.DB_USERNAME;
var db_secret = process.env.DB_PASSWORD;
var db_address = process.env.DB_LOCATION;
var db_table =  process.env.DB_TABLE;
var main_port	= process.env.PORT;

//passport config:
require('./config/passport')(passport)

//mongoose
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log(`Connected on Port: ${main_port}`))
.catch((err)=> console.log(err));

//EJS
app.use('/public', express.static(path.join(__dirname, "public")));
app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })
    
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(main_port); 
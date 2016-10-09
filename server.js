var express = require('express');
var app = express();

var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');


app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true}));


app.set('view engine', 'ejs');

// Let's use passport

// Rutas en EJS
app.get('/', function (req, res) {
    res.redirect('/negocios');
});

app.get('/negocios', function(req, res){
    res.render('pages/business', { title: 'Hey,', message: 'Hello Cooks!'});
});

app.get('/sync-stripe', function(req, res){
    res.render('pages/sync-stripe');
});

app.get('/stripe-listo', function(req, res){
    res.render('pages/stripe-listo');
});

app.get('/stripe-error', function(req, res){
    res.render('pages/stripe-error');
});

app.get('/clients', function(req, res){
    res.render('pages/about');
});

app.get('/landing', function(req, res){
    res.render('pages/landing');
});

app.get('/demo', function(req, res){
    res.render('pages/demo');
});



app.set('port', (process.env.PORT || 3000));


app.listen(app.get('port'), function() {
  console.log('panza-web corriendo en: http://localhost:'+ app.get('port'));
});

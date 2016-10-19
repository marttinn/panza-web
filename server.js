var express = require('express');
var app = express();

var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var config	 = require('./config');
var shortid = require('shortid');
var slug = require('slug');
var dotenv  = require('dotenv');
var request = require('request');

var Seller	   = require('./app/models/seller');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true}));

dotenv.config();
mongoose.connect(process.env.DATABASE_URL); // connect to db

app.set('view engine', 'ejs');

// Let's use passport

// Rutas en EJS
app.get('/', function (req, res) {
    res.redirect('/negocios');
});

app.get('/negocios', function(req, res){
    res.render('pages/business', { title: 'Hey,', message: 'Hello Cooks!'});
});

// app.get('/sync-stripe', function(req, res){
//     res.render('pages/sync-stripe');
// });

app.get('/stripe-connection', function(req, res){

    if(req.query.code){
        //make post
        var code = req.query.code;

        request.post({
            url: process.env.TOKEN_URI,
            form: {
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID,
                code: code,
                client_secret: process.env.API_KEY
            }
        }, function(err, re, body){

            var stripeCreds = JSON.parse(body);
            var clientID = req.query.state;

            console.log(clientID);

            Seller.findOneAndUpdate({'clientId': clientID}, { stripeCreds: stripeCreds}, function(err, seller){

                console.log(seller);
                if (err) return handleError(err);
                res.render('pages/stripe-listo', { stripeToken: JSON.stringify(seller.stripeCreds) });

            });


        });

    }

    if(req.query.error){
        res.render('pages/stripe-error');
    }


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

app.post('/crear-negocio', function(req, res){
    // console.log(req.body);
    var seller = req.body;

    Seller.create({
        ownerFullName: seller.nombre,
        businessName: seller.negocio,
        localPhone: seller.telefono,
        cellPhone: seller.celular,
        email: seller.email,
        password: seller.password,
        address: seller.direccion,
        interior: seller.interior,
        clientId: slug(seller.negocio) +"-"+ shortid.generate()
    }, function (err, createdSeller) {
        if (err) throw err;
        // saved!
        console.log("created: \n"+ createdSeller);
        res.render('pages/sync-stripe', {seller: createdSeller, sellerForState: createdSeller.clientId, authURL: process.env.AUTHORIZE_URI, clientID: process.env.CLIENT_ID});
    });

});


app.set('port', (process.env.PORT || 3000));


app.listen(app.get('port'), function() {
  console.log('panza-web corriendo en: http://localhost:'+ app.get('port'));
});

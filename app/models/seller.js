var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt = require('bcrypt');
var saltRounds = 10;


var SellerSchema   = new Schema({
    ownerFullName: String,
    businessName: String,
    localPhone: String,
    cellPhone: String,
    email: String,
    password: String,
    address: String,
    interior: String,
    clientId: String,
    stripeCreds:    {
      token_type: String,
      stripe_publishable_key: String,
      scope: String,
      livemode: Boolean,
      stripe_user_id: String,
      refresh_token: String,
      access_token: String
    }
});

SellerSchema.pre('save', function(next) {
    var seller = this;

    // only hash the password if it has been modified (or is new)
    if (!seller.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(seller.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            seller.password = hash;
            next();
        });
    });
});

SellerSchema.methods.checkPassword = function(checkingPassword, res) {
    bcrypt.compare(checkingPassword, this.password, function(err, matched) {
        if (err) return res(err);
        res(null, matched);
    });
};

// bcrypt.compareSync(myPlaintextPassword, hash); // true

// fetch user and test password verification
// User.findOne({ username: 'jmar777' }, function(err, user) {
//     if (err) throw err;
//
//     // test a matching password
//     user.comparePassword('Password123', function(err, isMatch) {
//         if (err) throw err;
//         console.log('Password123:', isMatch); // -&gt; Password123: true
//     });
//
//     // test a failing password
//     user.comparePassword('123Password', function(err, isMatch) {
//         if (err) throw err;
//         console.log('123Password:', isMatch); // -&gt; 123Password: false
//     });
// });

module.exports = mongoose.model('Seller', SellerSchema);

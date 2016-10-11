var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

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
      "token_type": String,
      "stripe_publishable_key": String,
      "scope": String,
      "livemode": Boolean,
      "stripe_user_id": String,
      "refresh_token": String,
      "access_token": String
    }
});

module.exports = mongoose.model('Seller', SellerSchema);

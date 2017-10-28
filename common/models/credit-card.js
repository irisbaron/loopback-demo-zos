'use strict';

module.exports = function(Creditcard) {
    var app = require("../../server/server");  
    
    Creditcard.getCards = function(MemberId) {
      var CreditCards = app.models.CreditCard;
      return CreditCards.find({where:{customerId:MemberId}})
    }
    
    Creditcard.getPoints = function(Card) {
      var weight = 1;
      if(Card.AccountType == "Gold")
          weight = 0.75
      else if(Card.AccountType == "Silver")
          weight = 0.5
      return weight*Card.Points;
    }
};

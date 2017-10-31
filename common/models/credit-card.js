'use strict';

module.exports = function(Creditcard) {
    var app = require("../../server/server");  
    
    Creditcard.getCards = function(MemberId) {
      var CreditCards = app.models.CreditCard;
      return CreditCards.find({where:{customerId:MemberId}})
    }
    
    Creditcard.getPoints = function(Card) {
      return Card.Points;
    }
};

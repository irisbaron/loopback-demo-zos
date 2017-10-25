'use strict';

module.exports = function(Creditcard) {
 var app = require("../../server/server");  
    Creditcard.getPoints = function(MemberId,Points) {
      var CreditCards = app.models.CreditCard;
      CreditCards.find({where:{customerId:MemberId}})
      .then(function(cards) {
        console.log(cards);
        cards.forEach(function(card) {
           Points.add(card.Points);
           })
      })
      .catch(function(error) {
       console.log("Error occured" +error);
      })
    }
};

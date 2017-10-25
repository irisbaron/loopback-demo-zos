'use strict';

module.exports = function(Customer) {
  var app = require("../../server/server");
  Customer.getPoints = function(Member) {
     var CreditCards = app.models.CreditCard;
     
  }
};

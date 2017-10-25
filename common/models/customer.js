'use strict';

module.exports = function(Customer) {
   var app = require("../../server/server");
   
   Customer.getMemberId = function(MemberName) {
     var Customers = app.models.Customer;
     return Customers.find({where:{Name:MemberName}})
   }
   
   Customer.getId = function(Member){
     return Member.id;
   } 
  
   Customer.getPgmId = function(Member) {
     return Member.programId;
   }
};

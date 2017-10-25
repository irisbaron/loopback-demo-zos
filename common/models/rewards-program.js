'use strict';

module.exports = function(Rewardsprogram) {
  var app = require("../../server/server");
  var async = require("async");
  
  Rewardsprogram.getPoints = function (Members,ProgramType,cb){
    var Customers = app.models.Customer;
    var CreditCards = app.models.CreditCard;

    //Collect the points for all customers enrolled in the program
    function Accumulator() {
        var Total = 0;
        var callback = cb;
        return { 
          add:function(Points) {
            Total += Points;
            console.log("New Total:" + Total);
          },
          getTotal:function() {
            return Total;
          }  
        }
     }
   
    //Find the customers listed
    var TotalPoints = Accumulator();
    var memberIdx;
    var promise_list = [];
    for (memberIdx = 0; memberIdx < Members.length; memberIdx++) {
          promise_list.push(Customers.find({where:{Name:Members[memberIdx]}}))
    }       
    
    //Accumulate all the poitns
    Promise.all(promise_list)
     .then(function() {
              while (promise_list.length) {
                 var promise = promise_list.pop();
                 promise
                 .then(function(customer) {
                       CreditCards.getPoints(customer[0].id,TotalPoints);
                 })
                 .catch(function(error) {
                        console.log("Error occured" + error);
                 })
              }
           cb(null, TotalPoints.getTotal());
           })
     .catch(function(err) {
               console.log("Error occured" + err);
            })
   };

   Rewardsprogram.remoteMethod("getPoints",{
     accepts: [
              {arg: "Members", type:"array"}, 
              {arg: "ProgramType", type:"string"}
              ],
     returns: {arg: "TotalPoints", type:"number"},
     http: {verb:"get"}      
     });
  
};

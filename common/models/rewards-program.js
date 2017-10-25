'use strict';

module.exports = function(Rewardsprogram) {
  var app = require("../../server/server");
  var async = require("async");
  
  Rewardsprogram.getPoints = function (Members,ProgramType,cb){
    var Customers = app.models.Customer;
    var CreditCards = app.models.CreditCard;

    
     function queryMemberId(Members) {
      return Promise.all(Members.map(Customers.getMemberId));
     }

     function queryCreditCards(MemberIds) {
       return Promise.all(MemberIds.map(CreditCards.getCards)); 
     } 

     function flattenRecords(queryResults, dataAccessor) {
        var records = queryResults.map(function(query) {
            return query.map(dataAccessor)
            });
        
        var flattenData = records.reduce(function(record1,record2) {
            return record1.concat(record2);
            })

        return flattenData;
     }


    /*Query Customers Credit Card Information, collect all the points 
      aggregate and return the sum
    */
     queryMemberId(Members)
     .then(function(queryResults){
           var memberIds = flattenRecords(queryResults,Customers.getId)
           queryCreditCards(memberIds)
           .then(function(queryResults) {
                   var points = flattenRecords(queryResults,CreditCards.getPoints);
                   var totalPoints = points.reduce(function(points1,points2) {
                       return points1 + points2;
                       });
                   cb(null,totalPoints);
           })
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

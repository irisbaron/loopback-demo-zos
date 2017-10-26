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


    /*Query Customers Information, check to see if they belong to the same rewardProgram
      then collect all the points, aggregate and return the sum
    */
     queryMemberId(Members)
     .then(function(queryResults){
           var rewardPgmIds = flattenRecords(queryResults,Customers.getPgmId);
           var referenceId = rewardPgmIds.pop();
           var memberSet = rewardPgmIds.filter(id => {
               return id == referenceId;
               });
           if (memberSet.length == 0)
               cb(null,0);
           var memberIds   = flattenRecords(queryResults,Customers.getId);
           queryCreditCards(memberIds)
           .then(function(queryResults) {
                   var points = flattenRecords(queryResults,CreditCards.getPoints);
                   var totalPoints = points.reduce(function(points1,points2) {
                       return points1 + points2;
                       });
                   cb(null,totalPoints);
           })
           .catch(function(error) {
                  console.log("Error occured in CreditCard query " + error);    
           })
     })
     .catch(function(error) {
            console.log("Error occured in Customer query" + error);
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

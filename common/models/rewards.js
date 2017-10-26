'use strict';

module.exports = function(Rewards) {
   
   
    
   /*Query Customers Information, check to see if they belong to the same rewardProgram
     then collect all the points, aggregate and return the sum
   */
   Rewards.getPoints = function (Members,cb){
     
     var app = require("../../server/server");
     var Customers = app.models.Customer;
     var CreditCards = app.models.CreditCard;
   
     function sendQuery(Records,FieldAccessor) {
         return Promise.all(Records.map(FieldAccessor));
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

     sendQuery(Members,Customers.getMemberId)
     .then(function(queryResults){
           var rewardPgmIds = flattenRecords(queryResults,Customers.getPgmId);
           var referenceId = rewardPgmIds.pop();
           var memberSet = rewardPgmIds.filter(id => {
               return id == referenceId;
               });
           if (memberSet.length == 0)
               cb(null,0);
           var memberIds   = flattenRecords(queryResults,Customers.getId);
           sendQuery(memberIds,CreditCards.getCards)
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

   /*Create a rewards program account for current credit Card
     holders*/
   Rewards.createAccount = function(Members, cb) {
      
   };

   /*Update user points total by making the appropriate updates
     to their credit card info*/
   Rewards.claimPoints = function(Members, claimedPoints, cb) {
              
   };

   /*Delete an account if members chose to close the account*/
   Rewards.closeAccount = function(Members, cb) {
   
   };
   
   Rewards.remoteMethod("createAccount", {
     accepts: [
              {arg: "Members", type: "array"}
              ],
     returns: {arg: "TotalPoints", type:"number"},
     http: {verb:"post"}
     });      

   Rewards.remoteMethod("getPoints",{
     accepts: [
              {arg: "Members", type:"array"} 
              ],
     returns: {arg: "TotalPoints", type:"number"},
     http: {verb:"get"}      
     });
  
   Rewards.remoteMethod("claimPoints", {
     accepts: [ 
              {arg: "Members", type: "array"},
              {arg: "claimedPoints", type:"number"}
              ],
     returns: {arg: "RemainingPoints", type: "number"},
     http: {verb:"put"}
     });

   Rewards.remoteMethod("deleteAccount", {
     accepts: [
              {arg: "Members", type: "array"},
              ],
     http: {verb:"delete"}
     });
};

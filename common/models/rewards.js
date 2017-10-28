'use strict';

module.exports = function(Rewards) {
   
   /*General Utility Functions*/
   Rewards.sendQuery = function(Records, FieldAccessor) {
     return Promise.all(Records.map(FieldAccessor));
   };

   Rewards.flattenRecords = function(queryResults, dataAccessor) {
     var records = queryResults.map(function(query) {
        return query.map(dataAccessor)
     });
     
     var flattenData = records.reduce(function(record1,record2) {
         return record1.concat(record2);
     })
    return flattenData;
   };

   /*Query Customers Information, check to see if they belong to the same rewardProgram
     then collect all the points, aggregate and return the sum
   */
   Rewards.getPoints = function (Members,cb){
     var app = require("../../server/server");
     var Customers = app.models.Customer;
     var CreditCards = app.models.CreditCard;
     var Rewards = app.models.Reward;

     Rewards.sendQuery(Members,Customers.getMember)
     .then(function(queryResults){
           var rewardPgmIds = Rewards.flattenRecords(queryResults,Customers.getPgmId);
           var referenceId = rewardPgmIds.pop();
           var memberSet = rewardPgmIds.filter(id => {
               return id == referenceId;
               });
           if (memberSet.length == 0 || referenceId == null 
              || referenceId == undefined){
               cb(null,0);
               }
           var memberIds   = Rewards.flattenRecords(queryResults,Customers.getId);
           Rewards.sendQuery(memberIds,CreditCards.getCards)
           .then(function(queryResults) {
                   var points = Rewards.flattenRecords(queryResults,CreditCards.getPoints);
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
     var app = require("../../server/server");
     var Customers = app.models.Customer;
     var CreditCards = app.models.CreditCard;
     var Rewards = app.models.Reward;

     Rewards.sendQuery(Members,Customers.getMember)
       .then(function(queryResults) {
          var rewardPgmIds = Rewards.flattenRecords(queryResults,Customers.getPgmId);
          var referenceId = rewardPgmIds.pop();
          var memberSet = rewardPgmIds.filter(id => {
               return id == referenceId;
               });
           if (referenceId != undefined || referenceId !=null 
               || memberSet.length == 0) {
               var response = new Object;
               response.Status = "Rejected";
               response.Reason = "Member/Members are allready registered to another account";
               cb(null, response);
           } else {
              Rewards.create({AccountName :"NewAccount"},function(err,instance){
                queryResults.forEach(function(result) {
                    result.forEach(function(customer) {
                       customer.updateAttribute("programId", instance.id, function (err, customer){
                       console.log("Customer updated" + JSON.stringify(customer));
                       })
                    })
                })
               console.log(queryResults);
              });
              var response = new Object;
              response.Status = "Succesful";
              cb(null, response);
           }
       })
   };

   /*Update user points total by making the appropriate updates
     to their credit card info*/
   Rewards.claimPoints = function(Members, claimedPoints, cb) {
              
   };

   /*Delete an account if members choose to close the account*/
   Rewards.closeAccount = function(Members, cb) {
   
   };
   
   Rewards.remoteMethod("createAccount", {
     accepts: [
              {arg: "Members", type: "array"}
              ],
     returns: { type:'object', root: 'true'}, 
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

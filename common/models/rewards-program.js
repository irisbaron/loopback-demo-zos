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

    function getPoints(Card) {
        return Card.Points;
    }
    
    function getId(Member) {
        return Member.id
    }

   queryMemberId(Members)
   .then(function(queryResults) {
        var ids = queryResults.map(function(query) {
            return query.map(getId)
         });
        var flattenedIds = ids.reduce(function(id1,id2) {
            return id1.concat(id2); 
        })
        queryCreditCards(flattenedIds)
        .then(function(queryResults) {
           var points = queryResults.map(function(query) {
              return query.map(getPoints)
           });
           var flattenedPoints = points.reduce(function(points1,points2) {
              return points1.concat(points2);
           });
           var totalPoints = flattenedPoints.reduce(function(points1,points2) {
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

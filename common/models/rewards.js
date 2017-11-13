'use strict'

module.exports = function (Rewards) {
   /* General Utility Functions */
  Rewards.sendQuery = function (Records, FieldAccessor) {
    return Promise.all(Records.map(FieldAccessor))
  }

  Rewards.flattenRecords = function (queryResults, dataAccessor) {
    var records = queryResults.map(function (query) {
      return query.map(dataAccessor)
    })

    var flattenData = records.reduce(function (record1, record2) {
      return record1.concat(record2)
    })
    return flattenData
  }

   /* Query Customers Information, check to see if they belong to the same rewardProgram
     then collect all the points, aggregate and return the sum
   */
  Rewards.getPoints = function (Members, cb) {
    var app = require('../../server/server')
    var Customers = app.models.Customer
    var CreditCards = app.models.CreditCard
    var Rewards = app.models.Rewards

    Rewards.sendQuery(Members, Customers.getMember)
       .then(function (queryResults) {
         var rewardPgmIds = Rewards.flattenRecords(queryResults, Customers.getPgmId)
         var referenceId = rewardPgmIds.pop()
         var memberSet = rewardPgmIds.filter(id => {
           return id === referenceId
         })
         if (referenceId === null || referenceId === undefined ||
               memberSet.length === 0) {
           cb(null, 0)
         }
         var memberIds = Rewards.flattenRecords(queryResults, Customers.getId)
         Rewards.sendQuery(memberIds, CreditCards.getCards)
           .then(function (queryResults) {
             var points = Rewards.flattenRecords(queryResults, CreditCards.getPoints)
             var totalPoints = points.reduce(function (points1, points2) {
               return points1 + points2
             })
             cb(null, totalPoints)
           })
           .catch(function (error) {
             console.log('Error occured in CreditCard query ' + error)
           })
       })
     .catch(function (error) {
       console.log('Error occured in Customer query' + error)
     })
  }

   /* Create a rewards program account for current credit Card
     holders */
  Rewards.createAccount = function (Members, cb) {
    var app = require('../../server/server')
    var Customers = app.models.Customer
    var Rewards = app.models.Rewards

    Rewards.sendQuery(Members, Customers.getMember)
       .then(function (queryResults) {
         var rewardPgmIds = Rewards.flattenRecords(queryResults, Customers.getPgmId)
         var referenceId = rewardPgmIds.pop()
         var memberSet = rewardPgmIds.filter(id => {
           return id === referenceId
         })
         if (referenceId != undefined || referenceId != null ||
               memberSet.length === 0) {
           var response = {}
           response.Status = 'Rejected'
           response.Reason = 'Member/Members are allready registered to another account'
           cb(null, response)
         } else {
           Rewards.create(function (error, instance) {
             if (error) console.log('Error occured in Reward account creation' + error)
             queryResults.forEach(function (result) {
               result.forEach(function (customer) {
                 customer.updateAttribute('programId', instance.id, function (error, customer) {
                   if (error) console.log('Error occured in customer records update' + error)
                   console.log('Customer Record updated:' + JSON.stringify(customer))
                 })
               })
             })
             console.log(queryResults)
           })
           var response = {}
           response.Status = 'Succesful'
           cb(null, response)
         }
       })
       .catch(function (error) {
         console.log('Error occured in Customer query' + error)
       })
  }

   /* Update user points total by making the appropriate updates
     to their credit card info */
  Rewards.claimPoints = function (claimedPoints, cb) {
    var app = require('../../server/server.js')
    var Customers = app.models.Customer
    var CreditCards = app.models.CreditCard
    var Rewards = app.models.Rewards
    var Members = claimedPoints.map(function (claim) {
      return claim.Name
    })
    var pointsToDeduct = claimedPoints.map(function (claim) {
      return claim.Points
    })
    Rewards.sendQuery(Members, Customers.getMember)
       .then(function (queryResults) {
         var rewardPgmIds = Rewards.flattenRecords(queryResults, Customers.getPgmId)
         var referenceId = rewardPgmIds.pop()
         var memberSet = rewardPgmIds.filter(id => {
           return id === referenceId
         })
         if (referenceId === null || referenceId === undefined ||
               memberSet.length === 0) {
           cb(null, 0)
         }
         var memberIds = Rewards.flattenRecords(queryResults, Customers.getId)
         Rewards.sendQuery(memberIds, CreditCards.getCards)
           .then(function (queryResults) {
             var points = Rewards.flattenRecords(queryResults, CreditCards.getPoints)
             var cardIndex = 0
                   // Check if both customers have sufficient points
             for (cardIndex = 0; cardIndex < points.length; cardIndex++) {
               if (points[cardIndex] < pointsToDeduct[cardIndex]) {
                 var response = {};
                 response.Status = "Failed";
                 response.Reason = "Insufficient points";
                 cb(null, response)
                 return
               }
             }
                   // Update customer credit card points total
             cardIndex = 0
             var remainingPoints = 0
             queryResults.forEach(function (query) {
               query.forEach(function (card) {
                 var newPoints = points[cardIndex] - pointsToDeduct[cardIndex]
                 card.updateAttribute('Points', newPoints, function (err, card) {
                   if (err) console.log('Error occured updating credit card info' + err)
                   console.log('Updated card Info:' + JSON.stringify(card))
                 })
                 cardIndex++
                 remainingPoints += newPoints
               })
             })
             cb(null, {Status: 'Success', RemainingPoints: remainingPoints})
           })
           .catch(function (error) {
             console.log('Error occured in CreditCard query' + error)
           })
       })
       .catch(function (error) {
         console.log('Error occured in Customer query' + error)
       })
  }

   /* Delete an account if members choose to close the account */
  Rewards.closeAccount = function (Members, cb) {
    var app = require('../../server/server.js')
    var Customers = app.models.Customer
    var Rewards = app.models.Rewards

    Rewards.sendQuery(Members, Customers.getMember)
       .then(function (queryResults) {
         var rewardPgmIds = Rewards.flattenRecords(queryResults, Customers.getPgmId)
         var referenceId = rewardPgmIds.pop()
         var memberSet = rewardPgmIds.filter(id => {
           return id === referenceId
         })
         if (referenceId === undefined || referenceId === null ||
               memberSet.length === 0) {
           var response = {}
           response = 'Failed! Members are not registered in the same account'
           cb(null, response)
         } else {
           queryResults.forEach(function (result) {
             result.forEach(function (customer) {
               customer.updateAttribute('programId', null, function (error, result) {
                 if (error) console.log('Error occured updating customer record' + error)
                 console.log('Customer record updated' + JSON.stringify(customer))
               })
             })
           })
           response = 'Successfully closed Account'
           cb(null, response)
         }
       })
       .catch(function (error) {
         console.log('Error occured in CreditCard query' + error)
       })
  }

  Rewards.remoteMethod('createAccount', {
    accepts: [
              {arg: 'Members', type: 'array'}
    ],
    returns: { type: 'object', root: 'true'},
    http: {verb: 'post'}
  })

  Rewards.remoteMethod('getPoints', {
    accepts: [
              {arg: 'Members', type: 'array'}
    ],
    returns: {arg: 'TotalPoints', type: 'number'},
    http: {verb: 'get'}
  })

  Rewards.remoteMethod('claimPoints', {
    accepts: [
              {arg: 'claimedPoints', type: 'array'}
    ],
    returns: [
              {arg: 'Status', type: 'string'},
              {arg: 'RemainingPoints', type: 'number'}
    ],
    http: {verb: 'put'}
  })

  Rewards.remoteMethod('closeAccount', {
    accepts: [
              {arg: 'Members', type: 'array'}
    ],
    returns: [
              {arg: 'object', root: 'true'}
    ],
    http: {verb: 'delete'}
  })
}

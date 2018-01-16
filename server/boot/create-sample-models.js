/* Copyright 2018 IBM Corp. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
'use strict'

module.exports = function (app) {
  var Customer = app.models.Customer
  var CreditCard = app.models.CreditCard
  var Rewards = app.models.Rewards

  var customers = [
      {Name: 'Chandler'},
      {Name: 'Monica'},
      {Name: 'Joey'},
      {Name: 'Phoebe'},
      {Name: 'Ross'},
      {Name: 'Rachel'}
  ]

  var creditcards = [
     {AccountNumber: 1, Points: 1500, AccountType: 'Gold'},
     {AccountNumber: 2, Points: 1000, AccountType: 'Silver'},
     {AccountNumber: 3, Points: 10000, AccountType: 'Platinum'},
     {AccountNumber: 4, Points: 20000, AccountType: 'Platinum'},
     {AccountNumber: 5, Points: 10000, AccountType: 'Platnium'},
     {AccountNumber: 6, Points: 30000, AccountType: 'Platnium'}
  ]


   // Create Friend Rewards Program Info
  Rewards.create(function (err, instance) {
    if (err) return console.log(err)
    customers[2].programId = instance.id
    customers[3].programId = instance.id
    Customer.create(customers[2], function (err, instance) {
      if (err) return console.log(err)
      console.log('Customer created ', instance)
      creditcards[3].customerId = instance.id
      CreditCard.create(creditcards[3], function (err, instance) {
        if (err) return console.log(err)
        console.log('CreditCard created: ', instance)
      })
    })
    Customer.create(customers[3], function (err, instance) {
      if (err) return console.log(err)
      console.log('Customer created ', instance)
      creditcards[2].customerId = instance.id
      CreditCard.create(creditcards[2], function (err, instance) {
        if (err) return console.log(err)
        console.log('CreditCard created: ', instance)
      })
    })
    console.log('rewardsProgram created: ', instance)
  })

   // Create Family Rewards Program info
  Rewards.create(function (err, instance) {
    if (err) return console.log(err)
    customers[0].programId = instance.id
    customers[1].programId = instance.id
    Customer.create(customers[0], function (err, instance) {
      if (err) return console.log(err)
      console.log('Customer created: ', instance)
      creditcards[0].customerId = instance.id
      CreditCard.create(creditcards[0], function (err, instance) {
        if (err) return console.log(err)
        console.log('CreditCard created: ', instance)
      })
    })
    Customer.create(customers[1], function (err, instance) {
      if (err) return console.log(err)
      console.log('Customer created: ', instance)
      creditcards[4].customerId = instance.id
      CreditCard.create(creditcards[4], function (err, instance) {
        if (err) return console.log(err)
        console.log('CreditCard created: ', instance)
      })
    })
    console.log('rewardsProgram created: ', instance)
  })

  customers[4].programId = null
  Customer.create(customers[4], function (err, instance) {
    if (err) return console.log(err)
    console.log('Customer created: ', instance)
    creditcards[1].customerId = instance.id
    CreditCard.create(creditcards[1], function (err, instance) {
      if (err) return console.log(err)
      console.log('CreditCard created: ', instance)
    })
  })

  customers[5].programId = null
  Customer.create(customers[5], function (err, instance) {
    if (err) return console.log(err)
    console.log('Customer created:', instance)
    creditcards[5].customerId = instance.id
    CreditCard.create(creditcards[5], function (err, instance) {
      if (err) return console.log(err)
      console.log('Creditcard created: ', instance)
    })
  })
}

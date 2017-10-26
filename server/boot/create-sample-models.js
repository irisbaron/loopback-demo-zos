'use strict';

module.exports = function(app) {
   var Customer = app.models.Customer;
   var CreditCard = app.models.CreditCard;
   var RewardsProgram = app.models.Reward;

   var customers = [
      {Name : "Chandler"},
      {Name : "Monica"},
      {Name : "Joey"},
      {Name : "Phoebe"}
   ];

   var creditcards = [
     {AccountNumber: 1, Points:1500, AccountType: "Gold"},
     {AccountNumber: 2, Points:1000, AccountType: "Silver"},
     {AccountNumber: 3, Points:10000, AccountType: "Platinum"},
     {AccountNumber: 4, Points:20000, AccountType: "Platinum"},
     {AccountNumber: 5, Points:10000, AccountType: "Platnium"}
   ];


   var rewardsPrograms = [
     {Type: "Family"},
     {Type: "Friend"}
   ]

  
   //Create Friend Rewards Program Info
   RewardsProgram.create(rewardsPrograms[1], function(err, instance) {
     if (err) return console.log(err);
     console.log("rewardsProgram created: ", instance);
     customers[2].programId = instance.id;
     customers[3].programId = instance.id;
     Customer.create(customers[2], function(err, instance) {
       if (err) return console.log(err);
       console.log("Customer Created ", instance);
       creditcards[3].customerId = instance.id;
       CreditCard.create(creditcards[3], function(err, instance) {
         if (err) return console.log(err);
         console.log("CreditCard Created: ", instance);
       })
     });
     Customer.create(customers[3], function(err, instance) {
       if (err) return console.log(err);
       console.log("Customer Created ", instance);
       creditcards[4].customerId = instance.id;
       CreditCard.create(creditcards[2], function(err, instance) {
         if (err) return console.log(err);
         console.log("CreditCard Created: ", instance);
       });
     });
   });
   
   //Create Family Rewards Program info
   RewardsProgram.create(rewardsPrograms[0], function(err, instance) {
     if (err) return console.log(err);
     console.log("rewardsProgram created: ", instance);
     customers[0].programId = instance.id;
     customers[1].programId = instance.id;
     Customer.create(customers[0], function(err, instance) {
        if (err) return console.log(err);
        console.log("Customer Created: ", instance);
        creditcards[0].customerId = instance.id;
        creditcards[1].customerId = instance.id;
        CreditCard.create(creditcards[0], function (err, instance) {
          if (err) return console.log(err);
          console.log("CreditCard Created: ", instance);
        });
     });
     Customer.create(customers[1], function(err, instance) {
        if (err) return console.log(err);
        console.log("Customer Created: ", instance);
        creditcards[2].customerId = instance.id;
        CreditCard.create(creditcards[2], function (err, instance) {
          if (err) return console.log(err);
          console.log("CreditCard Created: ", instance);
        });
     });
   });


};

module.exports = function(app) {
/*
 function getRewardsProgramPoints(records) {
    var RewardsProgram = app.models.RewardsProgram;   
       records.forEach(function(record){ 
          RewardsProgram.find({
                include: { 
                relation: 'customers',
                scope: {
                   where : {
                     Name: record.Name
                     },
                   include: {
                     relation: 'creditCards'
                       }
                     }
                  }
            },function (err,programs) {
                programs.forEach(function(program) {
                    var p = program.toJSON();
                    console.log(p);
                    p.customers.forEach(function (customer) {
                        console.log(customer.creditCards);
                        customer.creditCards.forEach(function(card) {
                           console.log(card.Points);
                        });
                    });
                  });
            });
        })
   }   
  
  getRewardsProgramPoints([{Name:"Monica",RewardPgm:undefined},{Name:"Chandler",RewardPgm:undefined}]);
*/
}

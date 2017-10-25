module.exports = function(app) {
  var RewardsProgram = app.models.RewardsProgram;
  RewardsProgram.nestRemoting('customers');
}

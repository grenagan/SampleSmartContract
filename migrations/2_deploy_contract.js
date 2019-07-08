var Migrations = artifacts.require("./Migrations.sol");
var SumNumbers = artifacts.require("./SumNumbers.sol");
//represents contract abstraction

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(SumNumbers);
};
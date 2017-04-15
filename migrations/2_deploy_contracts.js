var strings = artifacts.require("./strings.sol");
var supplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(strings);
  deployer.link(strings, supplyChain);
  deployer.deploy(supplyChain);
};

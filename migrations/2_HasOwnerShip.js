const HasOwnerShip = artifacts.require("HasOwnerShip");

module.exports = function(deployer) {
  deployer.deploy(HasOwnerShip);
};

// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import supply_chain_artifacts from '../../build/contracts/SupplyChain.json'

// SupplyChain is our usable abstraction, which we'll use through the code below.
var SupplyChain = contract(supply_chain_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the SupplyChain abstraction for Use.
    SupplyChain.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

    });
  },


  joinContract: function(name) {
      var self = this;

      SupplyChain.deployed().then(function(instance) {
          instance.join(name, {from: account});
      }).then(function() {
          console.log(name + " joined contract successfully.");
      }).catch(function(e) {
          console.log(e);
      });
  },


  viewFunds: function() {
      var self = this;
      var funds;

      SupplyChain.deployed().then(function(instance) {
          funds = instance.viewFunds({from: account});
      }).then(function() {
          console.log(funds);
      }).catch(function(e) {
          console.log(e);
      });

      return funds;
  },


  getCurrentOwner: function(serial) {
      var self = this;
      var owner;

      SupplyChain.deployed().then(function(instance) {
          owner = instance.getCurrentOwner(serial, {from: account});
      }).then(function() {
          console.log(owner);
      }).catch(function(e) {
          console.log(e);
      });

      return owner;
  },


  getOwnerHistory: function(serial) {
      var self = this;
      var history;

      SupplyChain.deployed().then(function(instance) {
          history = instance.getOwnerHistory(serial, {from: account});
          console.log(history);
      }).catch(function(e) {
          console.log(e);
      });

      return history;
  },


  deposit: function(amount) {
      var self = this;
      var success;

      SupplyChain.deployed().then(function(instance) {
          success = instance.deposit(amount, {from: account});
          if (success == "true") {
              console.log("Deposit successful.");
          } else {
              console.log("Deposit failed.");
          }
      }).catch(function(e) {
          console.log(e);
      });

      return success;
  },


  withdraw: function() {
      var self = this;
      var success;

      SupplyChain.deployed().then(function(instance) {
          success = instance.withdraw({from: account});
          if (success == "true") {
              console.log("Withdraw successful.");
          } else {
              console.log("Withdraw failed.");
          }
      }).catch(function(e) {
          console.log(e);
      });

      return success;
  },

  getItemName: function(id) {

  },

  getItemForSale: function() {

  },


  getOwnedItems: function(id) {

  },

  getSalePrice: function(id) {

  },


};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 SupplyChain, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});

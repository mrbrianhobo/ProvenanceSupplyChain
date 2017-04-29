// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import {smartContract, EthClient} from '../../SmartContractSetup.js';
//Call Functions as smartContract.function() 
//smartcontract.fucntion.sendTransaction(parameters,  {from: EthereumClient.eth.accounts[0], gas:100000})

// Import our contract artifacts and turn them into usable abstractions.
import supplyChain_artifacts from '../../build/contracts/SupplyChain.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
var SupplyChain = contract(supplyChain_artifacts);
const EthereumClient = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;
    console.log("started");
    // Bootstrap the MetaCoin abstraction for Use.
    // SupplyChain.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
    SupplyChain.setProvider(web3.currentProvider);
    console.log("provided");

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

      // self.refreshBalance();
    });
  },

  // setStatus: function(message) {
  //   var status = document.getElementById("status");
  //   status.innerHTML = message;
  // },

  joinContract: function(name) {
    var self = this;
      // console.log(SupplyChain.deployed());
      var x = smartContract.join.sendTransaction(name,  {from: EthClient.eth.accounts[0], gas:1000000});
      console.log(x);
      // SupplyChain.deployed().then(function(instance) {
      //   // var x = instance.join.sendTransaction(name, {from: EthereumClient.eth.accounts[0], gas: 100000});
      //   x = smartContract.join.call(name,  {from: EthClient.eth.accounts[0], gas:100000});
      //   // smartContract.join.sendTransaction(name,  {from: EthClient.eth.accounts[0], gas:100000});
      //   // funds = instance.viewFunds.sendTransaction({from: account});
      //   // smartContract.join.sendTransaction(name, {from: EthereumClient.eth.accounts[0], gas:100000});
      //   // console.log(x);

      // }).then(function() {
      //     // console.log(name + " joined contract successfully.");
      //     console.log(x);
      // }).catch(function(e) {
      //     console.log(e);
      // });
      // console.log(funds);
      if(smartContract.hasJoined.call()){
        var currName = smartContract.getYourName.call();
        if(currName == name){
          return "You have joined the contract as " + currName;
        }
        else {
          return "You have already joined as " + currName;
        }
      }
      else {
        return "There was an error joining the contract.";
      }

  },


  viewFunds: function() {
      // window.App.start();

      var self = this;

      // var funds = smartContract.viewFunds.sendTransaction({from: EthClient.eth.accounts[0], gas:100000});
      var funds = smartContract.viewFunds.call().toNumber();
      // console.log("viewfunds");
      // SupplyChain.deployed().then(function(instance) {
      //     console.log("shit");
      //     // funds = instance.viewFunds.sendTransaction({from: account});
      //     funds = smartContract.viewFunds.sendTransaction({from: EthClient.eth.accounts[0], gas:100000});
      // }).then(function() {
      //     console.log(funds);
      // }).catch(function(e) {
      //     console.log(e);
      // });
      // console.log(funds);

      return funds;
  },

  getMyName: function() {
      // window.App.start();

      var self = this;

      // var funds = smartContract.viewFunds.sendTransaction({from: EthClient.eth.accounts[0], gas:100000});
      var name = smartContract.getYourName.call();
      // console.log("viewfunds");
      // SupplyChain.deployed().then(function(instance) {
      //     console.log("shit");
      //     // funds = instance.viewFunds.sendTransaction({from: account});
      //     funds = smartContract.viewFunds.sendTransaction({from: EthClient.eth.accounts[0], gas:100000});
      // }).then(function() {
      //     console.log(funds);
      // }).catch(function(e) {
      //     console.log(e);
      // });


      return name;
  },


  getCurrentOwner: function(serial) {
      var self = this;
      var owner = smartContract.getCurrentOwner.call(serial);

      // SupplyChain.deployed().then(function(instance) {
      //     owner = instance.getCurrentOwner(serial, {from: account});
      // }).then(function() {
      //     console.log(owner);
      // }).catch(function(e) {
      //     console.log(e);
      // });

      return owner;
  },


  getOwnerHistory: function(serial) {
      var self = this;
      var history = smartContract.getOwnerHistoryArray(serial);

      // SupplyChain.deployed().then(function(instance) {
      //     history = instance.getOwnerHistoryArray(serial, {from: account});
      //     console.log(history);
      // }).catch(function(e) {
      //     console.log(e);
      // });

      return history;
  },


  deposit: function(amount) {
      var self = this;

      var dep = smartContract.deposit.sendTransaction({from: EthClient.eth.accounts[0],  gas:1000000, value: amount});
      var success = smartContract.deposit.call({from: EthClient.eth.accounts[0],  gas:1000000, value: amount});
      // SupplyChain.deployed().then(function(instance) {
      //     success = instance.deposit(amount, {from: account});
      //     console.log(success);
      //     if (success == "true") {
      //         console.log("Deposit successful.");
      //     } else {
      //         console.log("Deposit failed.");
      //     }
      // }).catch(function(e) {
      //     console.log(e);
      // });

      return success;
  },


  withdraw: function() {
      var self = this;
      // var success;

      var dep = smartContract.withdraw.sendTransaction({from: EthClient.eth.accounts[0], gas:1000000});
      // var success = smartContract.withdraw.call({from: EthClient.eth.accounts[0], gas:1000000});
      // SupplyChain.deployed().then(function(instance) {
      //     success = instance.withdraw({from: account});
      //     if (success == "true") {
      //         console.log("Withdraw successful.");
      //     } else {
      //         console.log("Withdraw failed.");
      //     }
      // }).catch(function(e) {
      //     console.log(e);
      // });

      // return success;
  },

  getItemName: function(id) {
    var self = this;
    var name = smartContract.getItemName.call(id);
    // SupplyChain.deployed().then(function(instance) {
    //     name = instance.getItemName(id);

    //     if (name != null) {
    //         console.log(name);
    //     } else {
    //         console.log("No such item.");
    //     }
    // }).catch(function(e) {
    //     console.log(e);
    // });

    return name;

  },

  getItemsForSale: function() {
    var self = this;
    var saleArray = smartContract.getItemsForSaleArray.call();
    // SupplyChain.deployed().then(function(instance) {
    //     saleArray = instance.getItemsForSaleArray();

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return saleArray; //array of uints
  },


  getOwnedItems: function() {
    var self = this;
    var ownedItems = smartContract.getOwnedItemsArray.call();;
    // SupplyChain.deployed().then(function(instance) {
    //     ownedItems = instance.getOwnedItemsArray();

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return ownedItems; //array of uints

  },

  getSalePrice: function(serial) {
    var self = this;
    var salePrice = smartContract.getSalePrice.call(serial);
    // SupplyChain.deployed().then(function(instance) {
    //     ownedItems = instance.getSalePrice(id);

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return salePrice;  //int
    
  },

  getIsActive: function(serial) {
    var self = this;
    var active = smartContract.getIsActive.call(serial);
    // SupplyChain.deployed().then(function(instance) {
    //     active = instance.getIsActive(id);

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return active; //boolean

  },

  getItemParents: function(serial) {
    var self = this;
    var parents = smartContract.getItemParents.call(serial);
    // SupplyChain.deployed().then(function(instance) {
    //     parents = instance.getItemParents(id);

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return parents; //array of uints

  },

  isValidItem: function(serial) {
    var self = this;
    var valid = smartContract.isValidItem.call(serial);
    // SupplyChain.deployed().then(function(instance) {
    //     valid = instance.isValidItem(serial);

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return valid; //boolean
  },

  addItem: function(serial, name){
    var self = this;
    var addCheck = smartContract.addNewItem.call(serial, name);
    var added = smartContract.addNewItem.sendTransaction(serial, name, {from: EthClient.eth.accounts[0], gas:1000000});
    // SupplyChain.deployed().then(function(instance) {
    //     added = instance.addNewItem(id, name, {from: account});

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return addCheck; //Return an alert
    
  },

  addSoda: function(serial, name){
    var self = this;
    var addCheck = smartContract.createNewSoda.call(serial, name);
    var added = smartContract.createNewSoda.sendTransaction(serial, name, {from: EthClient.eth.accounts[0], gas:1000000});
    console.log(added);
    // SupplyChain.deployed().then(function(instance) {
    //     added = instance.createNewSoda(id, name, {from: account});

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return addCheck; //Return an alert
    
  },

  purchaseItem: function(serial){
    var self = this;
    var pruchaseCheck = smartContract.purchase.call(serial);
    var purchased = smartContract.purchase.sendTransaction(serial, {from: EthClient.eth.accounts[0], gas:1000000});
    console.log(purchased);
    // SupplyChain.deployed().then(function(instance) {
    //     added = instance.purchase(id, {from: account});

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return pruchaseCheck; //return an alert
  },

  markForSale: function(serial, value){
    var self = this;
    var saleCheck = smartContract.markForSale.call(serial, value);

    var sale = smartContract.markForSale.sendTransaction(serial, value, {from: EthClient.eth.accounts[0], gas:1000000});
    console.log(sale);
    // SupplyChain.deployed().then(function(instance) {
    //     sale = instance.markForSale(id, value, {from: account});

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return saleCheck; //return an alert
  },

  undoForSale: function(serial){
    var self = this;
    var undoCheck = smartContract.undoForSale.call(serial);
    var undo = smartContract.undoForSale.sendTransaction(serial, {from: EthClient.eth.accounts[0], gas:1000000});
    console.log(undo);
    // SupplyChain.deployed().then(function(instance) {
    //     undo = instance.undoForSale(id, {from: account});

    // }).catch(function(e) {
    //     console.log(e);
    // });

    return undoCheck; //return an alert
  },

  
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});

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
var myAccounts = EthClient.eth.accounts;
var myAccount = myAccounts[0];
var accounts;
var account = myAccounts[0]; 

window.App = {
  start: function() {
    var self = this;
    // SupplyChain.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
    // SupplyChain.setProvider(web3.currentProvider);
    // console.log("Provider set.");

    // Get the initial account balance so it can be displayed.
    // web3.eth.getAccounts(function(err, accs) {
    //   if (err != null) {
    //     alert("There was an error fetching your accounts.");
    //     return;
    //   }

    //   if (accs.length == 0) {
    //     alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
    //     return;
    //   }

    //   accounts = accs;
    //   account = myAccounts[0];
         account = myAccounts[0];
    // });

  },

  swapAccount: function(number) {
    var self = this;
    account = myAccounts[number];
    console.log("You have swapped to:" + account);
  },

  joinContract: function(name) {
    var self = this;
      var x = smartContract.join.sendTransaction(name,  {from: account, gas:1000000});
      console.log(x);

      if(smartContract.hasJoined.call({from: account})){
        var currName = smartContract.getYourName.call({from: account});
        if (currName == name) {
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
      var self = this;
      var funds = smartContract.viewFunds.call({from: account}).toNumber();
      return funds;
  },

  getCurrentAddress: function() {
    var self = this;
    return account;
  },

  getMyName: function() {
      var self = this;
      var name = smartContract.getYourName.call({from: account});
      return name;
  },

  getOwnerName: function(addr){
    var self = this;
    var name = smartContract.getOwnerName.call(addr, {from: account});
    return name;
  },

  getCurrentOwner: function(serial) {
      var self = this;
      var owner = smartContract.getCurrentOwner.call(serial, {from: account});
      return owner;
  },

  getOwnerHistory: function(serial) {
      var self = this;
      var history = smartContract.getOwnerHistoryArray.call(serial, {from: account});
      return history;
  },

  deposit: function(amount) {
      var self = this;
      var dep = smartContract.deposit.sendTransaction({from: account,  gas: 1000000, value: amount});
      var success = smartContract.deposit.call({from: account,  gas: 1000000, value: amount});
      return success;
  },

  withdraw: function() {
      var self = this;
      var dep = smartContract.withdraw.sendTransaction({from: account, gas:1000000});
      var success = smartContract.withdraw.call({from: account, gas:1000000});
      return success;
  },

  getItemName: function(id) {
    var self = this;
    var name = smartContract.getItemName.call(id, {from: account});
    return name;
  },

  getItemsForSale: function() {
    var self = this;
    var saleArray = smartContract.getItemsForSaleArray.call({from: account});
    return saleArray; //array of uints
  },

  getOwnedItems: function() {
    var self = this;
    var ownedItems = smartContract.getOwnedItemsArray.call({from: account});
    return ownedItems; // array of uints
  },

  getSalePrice: function(serial) {
    var self = this;
    var salePrice = smartContract.getSalePrice.call(serial, {from: account}).toNumber();
    return salePrice;
  },

  getIsActive: function(serial) {
    var self = this;
    var active = smartContract.getIsActive.call(serial, {from: account});
    return active; // boolean

  },

  getItemParents: function(serial) {
    var self = this;
    var parents = smartContract.getItemParents.call(serial, {from: account});
    return parents; // array of uints

  },

  isValidItem: function(serial) {
    var self = this;
    var valid = smartContract.isValidItem.call(serial, {from: account});
    return valid; // boolean
  },

  addItem: function(serial, name){
    var self = this;
    var addCheck = smartContract.addNewItem.call(serial, name, {from: account});
    var added = smartContract.addNewItem.sendTransaction(serial, name, {from: account, gas:1000000});
    return addCheck; // an alert
  },

  createNewItem: function(serial, name, parents){
    var self = this;
    var addCheck = smartContract.createItemWithParents.call(serial, name, parents, {from: account});
    var added = smartContract.createItemWithParents.sendTransaction(serial, name, parents, {from: account, gas:1000000});
    return addCheck; // an alert
  },

  purchaseItem: function(serial){
    var self = this;
    var pruchaseCheck = smartContract.purchase.call(serial, {from: account});
    var purchased = smartContract.purchase.sendTransaction(serial, {from: account, gas:1000000});
    return pruchaseCheck; // an alert
  },

  markForSale: function(serial, value){
    var self = this;
    var saleCheck = smartContract.markForSale.call(serial, value, {from: account});
    var sale = smartContract.markForSale.sendTransaction(serial, value, {from: account, gas:1000000});
    return saleCheck; // an alert
  },

  undoForSale: function(serial){
    var self = this;
    var undoCheck = smartContract.undoForSale.call(serial, {from: account});
    var undo = smartContract.undoForSale.sendTransaction(serial, {from: account, gas:1000000});
    return undoCheck; // an alert
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

Number.prototype.formatMoney = function(c){
    var n = this,
        c = 2,
        d = ".",
        t = ",",
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

window.displayBalance = function() {
    var balanceString = "<strong>Current Balance: </strong>$";
    var balance = App.viewFunds();
    if (parseFloat(balance)) {
        balanceString += parseFloat(balance).formatMoney();
    } else {
        balanceString += (0).formatMoney();
    }

    $(".balance-display").html(balanceString);
}

pragma solidity ^0.4.6;

import "github.com/Arachnid/solidity-stringutils/strings.sol";

contract SupplyChain {

    using strings for *;

    mapping(address => Owner) owners;
    mapping(uint => Item) items; //uint is a serial number

    int numOwners = 0;
    int numItems = 0;


     struct Owner {
        address addr;
        string name;
        uint[] ownedItems; //Cant use mapping because we want to be able to list out the owned items in a function
        uint value;
    }

    struct Item {
        uint identification; //Serial Number
        string iname;
        address[] ownerHistory; //Can't use mapping because we need an order
        bool forSale; //Does the current owner want to give up the item?
        Owner currentOwner;
        uint salePrice;

    }


    function join(string name) public returns(string){
        if (owners[msg.sender].addr == msg.sender) {
            return "You can't join again";
        }
        uint[] temp;
        owners[msg.sender] = Owner(msg.sender, name, temp, 0); //Add owner into mapping
        numOwners++;
        return "You have joined the contract!";

    }

    function deposit() public payable returns(string){
        if(msg.value <= 0){
            return "That is not a valid deposit.";
        }

        if(owners[msg.sender].addr != msg.sender){
            throw;
        }
        uint256 amount = msg.value/1000000000000000000;
        owners[msg.sender].value += amount;
        return "You have successfully deposited: ".toSlice().concat(uintToString(amount).toSlice());
        // return "You have successfully deposited the money";

    }

    function viewFunds() public returns(uint256){
        if(owners[msg.sender].addr != msg.sender){
            throw;
        }
        return owners[msg.sender].value;
    }

    function withdraw() public payable returns(string){
        if(owners[msg.sender].addr != msg.sender){
            throw;
        }
        if(!msg.sender.send(owners[msg.sender].value)){
            throw;
        }
        owners[msg.sender].value = 0;
        return "You have withdrawn all your funds from the contract";

    }

    function addItem(uint serial, string n) public returns(string){ //As of now there is no buy in or payment for getting in. Only cost is gas.
        if (items[serial].identification == serial) {
            return "Item already exists. Try again";
        }

        Owner first = owners[msg.sender];
        if(first.addr != msg.sender){
            return "You are not a valid owner";
        }

        address[] firstOwner;
        firstOwner.push(msg.sender); //Create list with first item as owner

        items[serial] = Item(serial, n, firstOwner, false, owners[msg.sender],  2**256 - 1); //Add item into mapping
        numItems++; //Increment number of items

        first.ownedItems.push(serial);

        return "You have successfully added an item: ".toSlice().concat(n.toSlice());
    }


    function lookupOwnerHistory(uint serial) public returns(string){
        if(items[serial].identification != serial){

            return "There is no such item";
        }

        string memory temp;
        for(uint i = 0; i < items[serial].ownerHistory.length; i++){
            temp = temp.toSlice().concat(owners[items[serial].ownerHistory[i]].name.toSlice());
            if(i < items[serial].ownerHistory.length - 1){
                temp = temp.toSlice().concat(", ".toSlice());
            }
        }
        return temp;

    }

    function markForSale(uint serial, uint price) public returns(string){
        Item i = items[serial];
        Owner o = owners[msg.sender];
        if(items[serial].identification != serial){
            return "There is no such item";
        }

        if(price < 0){
            return "Not a valid price";
        }

        bool contains = false;

        for(uint x = 0; x < o.ownedItems.length; x++){  //Checks if the owner actually owns the item
            if(o.ownedItems[x] == i.identification){
                contains = true;
                break;
            }
        }

        if(contains){
            i.forSale = true; // set to false after item is transfered
            i.salePrice = price;
            string memory retmsg = i.iname.toSlice().concat(" marked for sale".toSlice());
            return retmsg;
        }
        else {
            return "You do not own that item.";
        }

    }

    function undoForSale(uint serial) public returns(string){
        Item i = items[serial];
        if(items[serial].identification != serial){
            return "There is no such item";
        }

        Owner o = owners[msg.sender];

        bool contains = false;

        for(uint x = 0; x < o.ownedItems.length; x++){  //Checks if the owner actually owns the item
            if(o.ownedItems[x] == i.identification){
                contains = true;
                break;
            }
        }

        if(contains){
            i.forSale = false; // set to false after item is transfered
            i.salePrice =  2**256 - 1;
            string memory ret = i.iname.toSlice().concat(" is now not for sale.".toSlice());
            return ret;
        }
        else {
            return "You do not own that item.";
        }
    }


    function updateOwnedItems(Owner o, uint loc) private {  //Use similar method as this to update the owned items
        if (o.ownedItems.length <= 0 || loc >=  o.ownedItems.length) {
            return;
        }
        for (uint i = loc; i < o.ownedItems.length -1; i++) {
            o.ownedItems[i] = o.ownedItems[i+1];
        }
        delete o.ownedItems[i+1];
    }

    function purchase(uint serial) public returns(string){  //New owner obtains an item that is marked for relinquishing
         Item i = items[serial];
        if(items[serial].identification != serial){
            return "There is no such item";
        }
        if(i.forSale){
            Owner newOwner = owners[msg.sender];
            if(newOwner.value < i.salePrice){
                return "You don't have enough money";
            }
            newOwner.value -= i.salePrice;
            Owner curr = i.currentOwner;
            i.ownerHistory.push(msg.sender);
            i.currentOwner = newOwner;
            newOwner.ownedItems.push(i.identification);

            for(uint index = 0; index < curr.ownedItems.length; index++){ //Update previous owner data
                if(curr.ownedItems[index] == i.identification){
                    updateOwnedItems(curr, index); //Remove the item from the previous owners owner's list
                    break;
                }
            }
            return "You have purchased the item";
        }
        else {
            return "Item not marked to be transfered/sold.";
        }

    }

    function getOwnedItems() public returns (string){
        if(owners[msg.sender].addr == msg.sender){

            string memory temp;
            for(uint i = 0; i < owners[msg.sender].ownedItems.length; i++){
                temp = temp.toSlice().concat(items[owners[msg.sender].ownedItems[i]].iname.toSlice());
                if(i < owners[msg.sender].ownedItems.length - 1){
                    temp = temp.toSlice().concat(", ".toSlice());
                }
            }
            return temp;

        }
        return "There is an error";
    }

    function uintToString(uint v) constant returns (string) {
      bytes32 ret;
        if (v == 0) {
             ret = '0';
        }
        else {
             while (v > 0) {
                  ret = bytes32(uint(ret) / (2 ** 8));
                  ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
                  v /= 10;
             }
        }

        bytes memory bytesString = new bytes(32);
        for (uint j=0; j<32; j++) {
             byte char = byte(bytes32(uint(ret) * 2 ** (8 * j)));
             if (char != 0) {
                  bytesString[j] = char;
             }
        }

        return string(bytesString);
    } 

}

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
        Item[] ownedItems; //Cant use mapping because we want to be able to list out the owned items in a function
    }

    struct Item {
        uint identification; //Serial Number
        string iname;
        Owner[] ownerHistory; //Can't use mapping because we need an order
        bool giveUp; //Does the current owner want to give up the item?
        Owner currentOwner;

    }


    function join(string name) public returns(string){
        if (owners[msg.sender].addr == msg.sender) {
            return "You can't join again";
        }
        Item[] temp;
        owners[msg.sender] = Owner(msg.sender, name, temp); //Add owner into mapping
        numOwners++;
        return "You have joined the contract!";

    }

    function addItem(uint serial, string n) public returns(string){ //As of now there is no buy in or payment for getting in. Only cost is gas.
        if (items[serial].identification == serial) {
            return "Item already exists. Try again";
        }

        Owner first = owners[msg.sender];
        if(first.addr == msg.sender){
            return "You are not a valid owner";
        }

        Owner[] firstOwner;
        firstOwner.push(owners[msg.sender]); //Create list with first item as owner

        items[serial] = Item(serial, n, firstOwner, false, owners[msg.sender]); //Add item into mapping
        numItems++; //Increment number of items

        first.ownedItems.push(items[serial]);

        return "You have successfully added an item";
    }


    function lookupOwnerHistory(uint serial) public returns(string){
        if(items[serial].identification != serial){

            return "There is no such item";
        }

        string temp;
        for(uint i = 0; i < items[serial].ownerHistory.length; i++){
            temp.toSlice().concat(items[serial].ownerHistory[i].name.toSlice());
            temp.toSlice().concat(" ".toSlice());
        }
        return temp;

    }

    function relinquish(uint serial) public returns(string){
        Item i = items[serial];
        Owner o = owners[msg.sender];
        if(items[serial].identification != serial){
            return "There is no such item";
        }

        bool contains = false;

        for(uint x = 0; x < o.ownedItems.length; x++){  //Checks if the owner actually owns the item
            if(o.ownedItems[x].identification == i.identification){
                contains = true;
                break;
            }
        }

        if(contains){
            i.giveUp = true; // set to false after item is transfered
            string memory retmsg = i.iname.toSlice().concat(" marked for transfer".toSlice());
            return retmsg;
        }
        else {
            return "You do not own that item.";
        }

    }

    function undoRelinquish(uint serial) public returns(string){
        Item i = items[serial];
        if(items[serial].identification != serial){
            return "There is no such item";
        }

        Owner o = owners[msg.sender];

        bool contains = false;

        for(uint x = 0; x < o.ownedItems.length; x++){  //Checks if the owner actually owns the item
            if(o.ownedItems[x].identification == i.identification){
                contains = true;
                break;
            }
        }

        if(contains){
            i.giveUp = false; // set to false after item is transfered
            string memory ret = i.iname.toSlice().concat(" marked as 'to keep'.".toSlice());
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

    function obtain(uint serial) public returns(string){  //New owner obtains an item that is marked for relinquishing
         Item i = items[serial];
        if(items[serial].identification != serial){
            return "There is no such item";
        }
        if(i.giveUp){
            Owner newOwner = owners[msg.sender];
            Owner curr = i.currentOwner;
            i.ownerHistory.push(newOwner);
            i.currentOwner = newOwner;
            newOwner.ownedItems.push(i);

            for(uint index = 0; index < curr.ownedItems.length; index++){ //Update previous owner data
                if(curr.ownedItems[index].identification == i.identification){
                    updateOwnedItems(curr, index); //Remove the item from the previous owners owner's list
                    break;
                }
            }
        }
        else {
            return "Item not marked to be transfered/sold.";
        }

    }


    function getOwnedItems() public returns (string){
        if(owners[msg.sender].addr == msg.sender){

            string temp;
            for(uint i = 0; i < owners[msg.sender].ownedItems.length; i++){
                temp.toSlice().concat(owners[msg.sender].ownedItems[i].iname.toSlice());
                temp.toSlice().concat(" ".toSlice());
            }
            return temp;

        }
        return "There is an error";
    }



}

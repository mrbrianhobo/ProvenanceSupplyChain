pragma solidity ^0.4.6;

contract SupplyChain {

    mapping(address => Owner) public owners; 
    mapping(uint => Item) public items; //uint is a serial number

    int numOwners = 0;
    int numItems = 0;

    struct Owner {
        address addr;
        string name;
        uint[] ownedItems; //Cant use mapping because we want to be able to list out the owned items in a function

    }

    struct Item {
        uint identification; //Serial Number
        string iname;
        string[] ownerNameHistory; //Can't use mapping because we need an order
        Owner[] ownerHistory; //Can't use mapping because we need an order
        bool giveUp; //Does the current owner want to give up the item?

    }

    function join(string name) public returns(string){
        if (owners[msg.sender] != null) {
            return "You can't join again";
        }
        uint[] temp;
        owners[msg.sender] = Owner(msg.sender, name, temp); //Add owner into mapping
        numOwners++;
        return "You have joined the contract!";

    }

    function addItem(uint serial, string n) public returns(string){ //As of now there is no buy in or payment for getting in. Only cost is gas.
        if (items[serial] != null) {
            return "Item already exists. Try again";
        }

        string[] firstOwnerName;
        firstOwnerName.push(owners[msg.sender].name); //Create list with first item as owner's name

        Owner[] firstOwner;
        firstOwner.push(owners[msg.sender]); //Create list with first item as owner

        items[serial] = Item(serial, n, firstOwnerName, firstOwner, false); //Add item into mapping
        numItems++; //Increment number of items

        return "You have successfully added an item";
    }

    function lookupNameHistory(uint serial) public returns(string[]){
        if(items[serial] == null){
            string[] error;
            error.push("There is no such item");
            return error;
        }

        return item[serial].ownerNameHistory;

    }

    function lookupOwnerHistory(uint serial) public returns(string[]){
        if(items[serial] == null){
            string[] error;
            error.push("There is no such item");
            return error;
        }

        return item[serial].ownerHistory;

    }

    function relinquish(uint serial) public returns(string){
        Item i = items[serial];
        if(i== null){
            return "There is no such item";
        }

        Owner o = owners[msg.sender];

        bool contains = false;

        for(int x = 0; x < o.ownedItems.length; x++){  //Checks if the owner actually owns the item
            if(o.ownedItems[x].identification == i.identification){
                contains = true;
                break;
            }
        }

        if(contains){
            i.giveUp = true; // set to false after item is transfered
            return "You have marked"+ i.iname +"for transfer";
        }
        else {
            return "You do not own that item.";
        }

    }

    function undoRelinquish(uint serial) public returns(string){
        Item i = items[serial];
        if(i== null){
            return "There is no such item";
        }

        Owner o = owners[msg.sender];

        bool contains = false;

        for(int x = 0; x < o.ownedItems.length; x++){  //Checks if the owner actually owns the item
            if(o.ownedItems[x].identification == i.identification){
                contains = true;
                break;
            }
        }

        if(contains){
            i.giveUp = false; // set to false after item is transfered
            return "You have marked"+ i.iname +"as \"to keep\"";
        }
        else {
            return "You do not own that item.";
        }
    }


    // function updateQueue(Player[] arr, uint loc) private {  //Use similar method as this to update the owned items
    //     if (arr.length <= 0 || loc >=  arr.length) {
    //         return;
    //     }
    //     for (uint i = loc; i < arr.length -1; i++) {
    //         arr[i] = arr[i+1];
    //     }
    //     delete arr[i+1];
    // }

    function obtain(uint serial) public returns(string){  //New owner obtains an item that is marked for relinquishing

    }

}

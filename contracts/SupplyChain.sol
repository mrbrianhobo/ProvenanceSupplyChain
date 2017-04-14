pragma solidity ^0.4.8;

import "./strings.sol";

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
        address currentOwner;
        uint salePrice;
        bool active;
        uint[] parents;
    }

    uint[] itemsForSale;


    modifier correctOwner() {
        if(owners[msg.sender].addr != msg.sender) throw;
        _;
    }


    function join(string name) public returns (string) {
        if (owners[msg.sender].addr == msg.sender) {
            return "You can't join again";
        }
        uint[] memory temp;
        owners[msg.sender] = Owner(msg.sender, name, temp, 0); //Add owner into mapping
        numOwners++;
        return "You have joined the contract!";
    }

    function deposit() public payable correctOwner returns (string) {
        if (msg.value <= 0) {
            return "That is not a valid deposit.";
        }

        uint256 amount = msg.value/1000000000000000000;
        owners[msg.sender].value += amount;
        return "You have successfully deposited: ".toSlice().concat(uintToString(amount).toSlice());
        // return "You have successfully deposited the money";

    }

    function viewFunds() public correctOwner returns (uint256){

        return owners[msg.sender].value;
    }

    function withdraw() public payable correctOwner returns (string) {

        if (!msg.sender.send(owners[msg.sender].value)) {
            throw;
        }

        owners[msg.sender].value = 0;
        return "You have withdrawn all your funds from the contract";
    }

    function addNewItem(uint serial, string n) public returns (string) { //As of now there is no buy in or payment for getting in. Only cost is gas.
        if (items[serial].identification == serial) {
            return "Item already exists. Try again";
        }

        Owner first = owners[msg.sender];
        if (first.addr != msg.sender) {
            return "You are not a valid owner";
        }

        first.ownedItems.push(serial);
        items[serial] = Item(serial, n, new address[](0), false, first.addr, 2**256 - 1, true, new uint[](0)); //Add item into mapping
        items[serial].ownerHistory.push(msg.sender); //adds owner of item as first owner
        numItems++; //Increment number of items

        

        return "You have successfully added an item: ".toSlice().concat(n.toSlice());
    }

    //Insert "recipe" based items and make sure you own the items

    function createNewSoda(uint serial, string n) public returns (string) {
        // Requires sugar 12345 and water 13579
        if (items[serial].identification == serial) {
            return "Item already exists. Try again";
        }

        Owner first = owners[msg.sender];
        if (first.addr != msg.sender) {
            return "You are not a valid owner";
        }
        uint hasSugar = 2**256 - 1;
        uint hasWater = 2**256 - 1;
        for(uint i = 0; i < first.ownedItems.length; i++){
            if(hasSugar == 2**256 - 1 && items[first.ownedItems[i]].iname.toSlice().equals("Sugar".toSlice()) && !items[first.ownedItems[i]].forSale){
                hasSugar = i;
            }
            if(hasWater == 2**256 - 1 && items[first.ownedItems[i]].iname.toSlice().equals("Water".toSlice()) && !items[first.ownedItems[i]].forSale){
                hasWater = i;
            }

        }
        if(hasSugar == 2**256 - 1 || hasWater == 2**256 - 1){
            return "You do not own the ingredients";
        }
        

        items[first.ownedItems[hasSugar]].currentOwner = 0;
        items[first.ownedItems[hasSugar]].active = false;
        items[first.ownedItems[hasSugar]].currentOwner = 0;
        items[first.ownedItems[hasWater]].active = false;
        
        uint[] memory parent;
        // parent.push(first.ownedItems[hasSugar]);
        // parent.push(first.ownedItems[hasWater]);

        uint sugarID = first.ownedItems[hasSugar];
        uint waterID = first.ownedItems[hasWater];
        
        updateOwnedItems(first, first.ownedItems[hasSugar], first.ownedItems[hasWater]); 

        

        first.ownedItems.push(serial);
        
        items[serial] = Item(serial, n, new address[](0), false, first.addr, 2**256 - 1, true, parent); //Add item into mapping
        items[serial].ownerHistory.push(msg.sender); //adds owner of item as first owner
        numItems++; //Increment number of items

        items[serial].parents.push(sugarID);
        items[serial].parents.push(waterID);

        

        return "You have successfully added an item: ".toSlice().concat(n.toSlice());

    }




    function markForSale(uint serial, uint price) public returns (string) {
        Item i = items[serial];
        Owner o = owners[msg.sender];
        if (items[serial].identification != serial) {
            return "There is no such item";
        }

        if (msg.sender != i.currentOwner) {
            return "This is not your item";
        }

        if (price < 0) {
            return "Not a valid price";
        }

        bool contains = false;

        for (uint x = 0; x < o.ownedItems.length; x++) {  //Checks if the owner actually owns the item
            if (o.ownedItems[x] == i.identification) {
                contains = true;
                break;
            }
        }

        if (contains) {
            if (i.forSale) {
                return "Item already up for sale";
            }

            i.forSale = true; // set to false after item is transfered
            i.salePrice = price;
            itemsForSale.push(i.identification);
            string memory retmsg = i.iname.toSlice().concat(" marked for sale!".toSlice());
            return retmsg;
        } else {
            return "You do not own that item.";
        }

    }

    function undoForSale(uint serial) public returns (string) {
        Item i = items[serial];
        if (items[serial].identification != serial) {
            return "There is no such item";
        }

        if (msg.sender != i.currentOwner) {
            return "This is not your item";
        }

        Owner o = owners[msg.sender];
        bool contains = false;

        for (uint x = 0; x < o.ownedItems.length; x++) {  //Checks if the owner actually owns the item
            if (o.ownedItems[x] == i.identification) {
                contains = true;
                break;
            }
        }

        if (contains) {
            if (!i.forSale) {
                return "Item already not up for sale";
            }

            i.forSale = false; // set to false after item is transfered
            i.salePrice =  2**256 - 1;

            updateItems(i.identification);

            string memory ret = i.iname.toSlice().concat(" is now not for sale.".toSlice());
            return ret;
        } else {
            return "You do not own that item.";
        }
    }


    function purchase(uint serial) public returns (string) {  //New owner obtains an item that is marked for relinquishing
        Item i = items[serial];

        if (owners[msg.sender].addr != msg.sender) {
            return "You are not an owner";
        }
        if (items[serial].identification != serial) {
            return "There is no such item";
        }
        if (i.currentOwner == msg.sender) {
            return "You can't buy your own item.";
        }

        if(!items[serial].active){
            return "This item is inactive";
        }

        if (i.forSale) {
            Owner newOwner = owners[msg.sender];
            if (newOwner.value < i.salePrice) {
                return "You don't have enough money";
            }
            newOwner.value -= i.salePrice;
            Owner curr = owners[i.currentOwner];
            curr.value += i.salePrice;
            
            curr.ownedItems = remove(curr.ownedItems,serial); //Remove the item from the previous owners owner's list
            newOwner.ownedItems.push(i.identification);
            i.ownerHistory.push(msg.sender);
            i.currentOwner = newOwner.addr;
            i.forSale = false;

            updateItems(i.identification);

            return "You have purchased the item: ".toSlice().concat(i.iname.toSlice());
        } else {
            return "Item not marked to be transfered/sold.";
        }

    }

    function remove(uint[] array, uint val) private returns (uint[]) {
        uint[][1] memory temp;
        
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == val) {
                delete array[i];
                for (uint j = i; j < array.length - 1; j++) {
                    array[j] = array[j + 1];
                }
                temp[0] = array;
                //temp[0].length -= 1;
            }
        }
        return temp[0];
    }

    function updateOwnedItems(Owner x, uint ident, uint ident2) private {  //updates OwnedItems
        Owner o = owners[x.addr]; //Make this nonLocal
        if (o.ownedItems.length <= 0) {
            throw;
        }
        o.ownedItems = remove(o.ownedItems,ident);
        o.ownedItems = remove(o.ownedItems,ident2);
    }

    function updateItems(uint ident) private {  //update itemsForSale
        if (itemsForSale.length <= 0 ) {
            throw;
        }
        uint[] temp;

        for (uint i = 0; i < itemsForSale.length; i++) {
            if(itemsForSale[i] != ident){
                temp.push(itemsForSale[i]);
            }
        }
        itemsForSale = temp;
    }

    // function getOwnedItems() public returns (string) {
    //     if (owners[msg.sender].addr == msg.sender) { 

    //         string memory temp;
    //         for (uint i = 0; i < owners[msg.sender].ownedItems.length; i++) {
    //             temp = temp.toSlice().concat(uintToString(owners[msg.sender].ownedItems[i]).toSlice());
    //             temp = temp.toSlice().concat(": ".toSlice());
    //             temp = temp.toSlice().concat(items[owners[msg.sender].ownedItems[i]].iname.toSlice());
    //             if (i < owners[msg.sender].ownedItems.length - 1) {
    //                 temp = temp.toSlice().concat(", ".toSlice());
    //             }
    //         }
    //         return temp;

    //     }
    //     return "There is an error";
    // }

    // function getItemsForSale() public returns (string) {
    //     if (owners[msg.sender].addr == msg.sender) { 

    //         string memory temp;
    //         for (uint i = 0; i < itemsForSale.length; i++) {
    //             temp = temp.toSlice().concat(uintToString(itemsForSale[i].identification).toSlice());
    //             temp = temp.toSlice().concat(": ".toSlice());
    //             temp = temp.toSlice().concat(itemsForSale[i].iname.toSlice());
    //             temp = temp.toSlice().concat(", Cost: ".toSlice());
    //             temp = temp.toSlice().concat(uintToString(itemsForSale[i].salePrice).toSlice());
    //             if (i < itemsForSale.length - 1) {
    //                 temp = temp.toSlice().concat(", ".toSlice());
    //             }
    //         }
    //         return temp;

    //     }
    //     return "There is an error";
    // }


    function getItemsForSaleArray() public correctOwner returns (uint[]){

        return itemsForSale;
    }

    function getOwnedItemsArray() public correctOwner returns(uint[]){
         if (owners[msg.sender].addr == msg.sender) { 

            return owners[msg.sender].ownedItems;

        }
    }
    

    function getOwnerHistory(uint serial) public returns (string) {
        if (items[serial].identification != serial) {
            return "There is no such item";
        }

        string memory temp;
        for (uint i = 0; i < items[serial].ownerHistory.length; i++) {
            temp = temp.toSlice().concat(owners[items[serial].ownerHistory[i]].name.toSlice());
            if (i < items[serial].ownerHistory.length - 1) {
                temp = temp.toSlice().concat(" -> ".toSlice());
            }
        }
        return temp;
    }

    function getCurrentOwner(uint serial) public returns (string){
        if(items[serial].identification != serial) throw;
        if(!items[serial].active){
            return "This item is inactive";
        }

        return owners[items[serial].currentOwner].name;
    }

    function getItemName(uint serial) public returns (string){
        if(items[serial].identification != serial) throw;
        return items[serial].iname;
    }

    function getIsItemForSale(uint serial) public returns (bool){
        if(items[serial].identification != serial) throw;
        // if(items[serial].forSale){
        //     return "True";
        // }
        return items[serial].forSale;
    }

    function getSalePrice(uint serial) public returns(uint){
        if(items[serial].identification != serial) throw;
        Item temp = items[serial];
        if(!temp.forSale){
            return 0;
        }
        return temp.salePrice;
    }

    function getIsActive(uint serial) public returns (bool){
        if(items[serial].identification != serial) throw;
        
        return items[serial].active;
    }

    function isValidItem(uint serial) public returns (bool){
        if (items[serial].identification != serial){
            return false;
        }
        return true;

    }


    function uintToString(uint v) private constant returns (string) {
      bytes32 ret;
        if (v == 0) {
             ret = '0';
        } else {
            uint i = 0;
            while (v > 0) {
                  ret = bytes32(uint(ret) / (2 ** 8));
                  ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
                  v /= 10;
                  i++;
             }
        }

        bytes memory bytesString = new bytes(i);
        for (uint j=0; j<i; j++) {
             byte char = byte(bytes32(uint(ret) * 2 ** (8 * j)));
             if (char != 0) {
                  bytesString[j] = char;
             }
        }

        return string(bytesString);
    } 

}   

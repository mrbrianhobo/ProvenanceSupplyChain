# ProvenanceSupplyChain
SupplyChain Framework written in Solidity and deployed with [Truffle](https://github.com/trufflesuite/truffle). Includes contracts, migrations, user interface, and webpack build pipeline.

## Features ##
 * Depositing/Withdrawing ether into the contract
 * Adding items into the contract
 * Creating items from pre-existing items
 * Selling items to peers in the contract
 * Tracking owner history of items
 * Tracking item parents
 * Item search

## Additional Information ##
This contract is the general framework for a blockchain based supply chain management. The purpose of this contract is to provide a proof-of-concept for logging items and transactions at an industry level. We are using blockchain technology because it provides trust, automation, security, and assistance in accounting services.

## About us ##
We are members of the Provenance team within [Blockchain at Berkeley](https://blockchain.berkeley.edu/)  
We created a MVP for the provenance of pharmaceutical drugs to comply with the FDA's Drug Supply Chain Security Act (DSCSA)  
Slide Deck: https://drive.google.com/file/d/0B7NDXT-a_UJVMUk1ekxlVVBLa2s/view?usp=sharing  
Demo: https://drive.google.com/file/d/0BxNqVunSGSsHUGZtSEVpUWxRa0E/view  

## Contact us ##
Organization Email: consulting@blockchain.berkeley.edu  
Contact info for Provenance team members in the slide deck link above. 

## Usage
To initialize this project, clone the repository and follow the steps below.

## Building and the frontend
1. In an empty terminal, run `testrpc` to initialize a default testrpc server.
2. In a separate terminal, run `truffle compile`, then run `truffle migrate --reset` to deploy the contracts onto your network of choice (default "development").
3. Copy the SupplyChain: contract address that shows up on the truffle terminal and testrpc terminal and paste it into the `contractAddress` variable in`SmartContractSetup.js`
4. Then run `npm run build` to build the app.
5. Finally, run `truffle serve` to serve it on http://localhost:8080.

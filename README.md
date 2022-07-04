# MOC vendor tests and utils
## How to install

`npm install`

## Setup

1. Clone `.env.example` and save it as `.env`
2. Fill in wallet address and private key (it needs some testnet RBTC) in that file.

## DOC mint vendor test

Some DOC will be minted, paying the vendor their corresponging fee.

### How to run

1. Run `npm run doc-mint-test`

## MOC vendor utils

Vendor utilities. Checks current vendor status.

### How to run
1. Follow main setup (although _address_ in `.env` is not needed)
2. Choose network (*testnet* or *mainnet*, in `vendor-status.js` line 5)
3. Choose platform (*MOC* or *ROC*, in `vendor-status.js` line 8)
4. Setup address to use (in `vendor-status.js` line 10)
5. Run `npm run vendor-status`

### Staking MOC

Stakes vendor's MOC. 

### How to run
1. Follow main setup (although _address_ in `.env` is not needed)
2. Choose network (in `vendor-staking.js` line 5)
3. Choose platform (*MOC* or *ROC*, in `vendor-staking.js` line 8)
4. Setup amount to stake (in `vendor-staking.js` line 10)
5. Run `npm run vendor-staking`


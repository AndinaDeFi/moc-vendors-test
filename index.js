const fs = require("fs");
const Web3 = require("web3");
const BN = require("bn.js");
require('dotenv').config();

const web3 = new Web3("https://public-node.testnet.rsk.co:443");

const moc = new web3.eth.Contract(
  JSON.parse(fs.readFileSync("./moc.json", "utf8")),
  "0x2820f6d4d199b8d8838a4b26f9917754b86a0c1f"
);
const mocInrate = new web3.eth.Contract(
  JSON.parse(fs.readFileSync("./moc_inrate.json", "utf8")),
  "0x76790f846faaf44cf1b2d717d0a6c5f6f5152b60"
);

const privateKey = process.env.USER_PK;
const addressFrom = process.env.USER_ADDRESS;

(async () => {
  const amount = new BN(0.00000123 * Math.pow(10, 18));

  const commission = new BN(
    await mocInrate.methods.calcCommissionValue(amount, new BN(3)).call()
  );

  const value = amount.add(commission);

  const vendorAddress = "0x00add81c1cfae0ea2d487490cde322cb7e77aa5f";

  const encodedCall = moc.methods
    .mintDocVendors(value, vendorAddress)
    .encodeABI();

  const transaction = await web3.eth.accounts.signTransaction(
    {
      from: addressFrom,
      to: moc._address,
      value: value,
      gas: "800000",
      data: encodedCall,
    },
    privateKey
  );

  const receipt = await web3.eth.sendSignedTransaction(
    transaction.rawTransaction
  );

  console.log(receipt.transactionHash);
})();

const fs = require("fs");
require("dotenv").config();
const { ethers } = require("ethers");

// 2 - CHOOSE NETWORK (uncomment correct):
// const NETWORK = 'testnet';
const NETWORK = 'mainnet';
console.log(`--- CONFIGURING FOR ${NETWORK.toUpperCase()} ---`);

// 3 - CHOOSE PLATFORM (uncomment correct):
const PLATFORM = 'MOC';
// const PLATFORM = 'ROC';
console.log(`--- PLATFORM: ${PLATFORM} ---`);

// 3 - LEAVE EMPTY FOR USING OWN PRIVATE KEY OR WRITE AN ADDRESS
// (uncomment correct)
// let vendorAddress = '';
let vendorAddress = '0x370b58caf99780ba26da1600684a0f281421be2f';

// CONFIG END ------------------
NODE_URL = NETWORK == 'testnet' ?
    "https://public-node.testnet.rsk.co:443" :
    "https://public-node.rsk.co:443"

if (PLATFORM == 'MOC') {
    CONTRACT_ADDRESS = NETWORK == 'testnet' ?
        '0x84b895A1b7be8fAc64d43757479281Bf0b5E3719' :
        '0x2d442aA5D391475b6Af3ad361eA3b9818fb35BcA'
} else {
    CONTRACT_ADDRESS = NETWORK == 'testnet' ?
        '0x60E38CB11562C665A6efac87406B7B0bDE725576' :
        '0x581C819c48ed1a6c716A736361001B53D54A0a80'
}

const privateKey = process.env.USER_PK;
const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
const signer = new ethers.Wallet(privateKey, provider);

(async () => {
    if (vendorAddress == "") vendorAddress = await signer.getAddress();
    console.log(`Address: ${vendorAddress}`);

    const contractAbi = JSON.parse(fs.readFileSync('./contracts/moc_vendors.json', "utf8"));
    const mocVendorContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

    const isActive = await mocVendorContract.getIsActive(vendorAddress);
    console.log(`Vendor ${isActive ? 'activo' : 'inactivo'}`);

    const markup = await mocVendorContract.getMarkup(vendorAddress);
    console.log(`Vendor markup: ${markup}`);

    const totalPaid = await mocVendorContract.getTotalPaidInMoC(vendorAddress);
    console.log(`Total paid in MOC (after last settlement): ${totalPaid}`);

    const currentStake = await mocVendorContract.getStaking(vendorAddress);
    console.log(`Vendor current staked MOC: ${currentStake}`);
})()
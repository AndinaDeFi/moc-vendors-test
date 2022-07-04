const fs = require("fs");
require("dotenv").config();
const { ethers, BigNumber } = require("ethers");

// 2 - CHOOSE NETWORK (uncomment correct):
const NETWORK = 'testnet';
// const NETWORK = 'mainnet';
console.log(`--- CONFIGURING FOR ${NETWORK.toUpperCase()} ---`);

// 3 - CHOOSE PLATFORM (uncomment correct):
const PLATFORM = 'MOC';
// const PLATFORM = 'ROC';
console.log(`--- PLATFORM: ${PLATFORM} ---`);

// 4- SET UP AMOUNT TO STAKE
// const amountToStake = BigNumber.from(1e18.toString()) // 1e18 = 1 MOC
const amountToStake = BigNumber.from("0x2d66a5b4bc1da600000") // = 13400 MOC ~= 950 USD at 04/07/2022

// CONFIG END ------------------
NODE_URL = NETWORK == 'testnet' ?
    "https://public-node.testnet.rsk.co:443" :
    "https://public-node.rsk.co:443"

TOKEN_CONTRACT_ADDRESS = NETWORK == 'testnet' ?
    '0x45a97b54021a3f99827641afe1bfae574431e6ab' :
    '0x9ac7fe28967b30e3a4e6e03286d715b42b453d10'

if (PLATFORM == 'MOC') {
    VENDORS_CONTRACT_ADDRESS = NETWORK == 'testnet' ?
        '0x84b895a1b7be8fac64d43757479281bf0b5e3719' :
        '0x2d442aa5d391475b6af3ad361ea3b9818fb35bca'

} else {
    VENDORS_CONTRACT_ADDRESS = NETWORK == 'testnet' ?
        '0x60E38CB11562C665A6efac87406B7B0bDE725576' :
        '0x581C819c48ed1a6c716A736361001B53D54A0a80'
}

const privateKey = process.env.USER_PK;
const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
const signer = new ethers.Wallet(privateKey, provider);

const mocVendorsAbi = JSON.parse(fs.readFileSync('./contracts/moc_vendors.json', "utf8"));
const mocVendorsContract = new ethers.Contract(VENDORS_CONTRACT_ADDRESS, mocVendorsAbi, signer);

const mocTokenAbi = JSON.parse(fs.readFileSync('./contracts/moc_token.json', "utf8"));
const mocTokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, mocTokenAbi, signer);

(async () => {
    const vendorAddress = await signer.getAddress();
    console.log(`Vendor address: ${vendorAddress}`);

    // Approve MOC tokens to vendor
    const approveTx = await mocTokenContract.approve(
        VENDORS_CONTRACT_ADDRESS,
        amountToStake);
    await approveTx.wait();
    console.log(`Approved ${amountToStake / BigNumber.from(1e18.toString())} MOC to vendors contract`);

    // Stake MOC tokens
    const stakeTx = await mocVendorsContract.addStake(amountToStake);
    await stakeTx.wait();
    console.log(`Added ${amountToStake / BigNumber.from(1e18.toString())} MOC to stake`);
})()
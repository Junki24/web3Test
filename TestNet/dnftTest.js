const Web3 = require("web3")
const fs = require("fs")
const Tx = require("ethereumjs-tx")
const etherscanApi = require("etherscan-api").init('MCFJUDXVIXRTB6KVZAHR4Q7BKCP5E15GKV', 'sepolia', 3000)
const ethers = require("ethers");

const infura_token = fs.readFileSync('../infura_token', "utf8")
const private_key = fs.readFileSync('../private_key', "utf8")
const httpProvider = `https://sepolia.infura.io/v3/${infura_token}`
const wsProvider = `wss://sepolia.infura.io/ws/v3/${infura_token}`

const ByteCode_File = JSON.parse(fs.readFileSync('../contract/NFT1155/bytecode', 'utf-8'))
const bytecode = ByteCode_File.object
const abi = JSON.parse(fs.readFileSync('../contract/NFT1155/ABI', 'utf-8'))

// const web3 = new Web3(httpProvider)
const web3 = new Web3(wsProvider)
const nftContract = new web3.eth.Contract(abi)

const send_account = "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84"
const receive_account = "0x9C17C88A4752FBE7A2aA85bAD82651327AF68481"

const nftContractAddress = '0x0953918CB0d0C7036F3bdD048D871EE0f705411D'

const privateKeyBuffer = Buffer.from(private_key, "hex")

async function deployNftContract(nonce) {
    const options = {
        data: "0x" + bytecode,
    }

    const web3data = nftContract.deploy(options).encodeABI()
    const rawTransaction = await web3.eth.accounts.signTransaction({
        from: send_account,
        to: null,
        gas: "0xffffff",
        gasPrice: "0x3316f64f",
        value: null,
        data: web3data,
        nonce: web3.utils.toHex(nonce),
        chainId: 11155111
    }, private_key)

    return web3.eth.sendSignedTransaction(rawTransaction.rawTransaction);
}

async function callUri(id) {
    const myNftContract = new web3.eth.Contract(abi, nftContractAddress)
    const tokenInfo =  await myNftContract.methods['uri'](id).call()
    console.log(tokenInfo)
    const metadata = await fetch(tokenInfo).then((res) => res.json())
    return JSON.stringify(metadata)
}

async function test(){
    const nonce = await web3.eth.getTransactionCount(send_account)
    // const deployResult = await deployNftContract(nonce)
    // console.log("deployResult", deployResult)
    // const callUriResult = await callUri(1)
    // console.log("callUriResult", callUriResult)
}

test()
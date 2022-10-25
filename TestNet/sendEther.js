var Web3 = require("web3")
var fs = require("fs")
var Tx = require("ethereumjs-tx")

var infura_token = fs.readFileSync('../infura_token', "utf8")
var private_key = fs.readFileSync('../private_key', "utf8")
var httpProvider = `https://sepolia.infura.io/v3/${infura_token}`
var wsProvider = `wss://sepolia.infura.io/ws/v3/${infura_token}`

// const web3 = new Web3(httpProvider)
const web3 = new Web3(wsProvider)

const send_account = "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84"
const receive_account = "0x9C17C88A4752FBE7A2aA85bAD82651327AF68481"

const privateKeyBuffer = Buffer.from(private_key, "hex")

const newBlockCallback = async(err, result) => {
    if(err){
        console.log(err)
    }
    if(!err){
        const weiBalance = await web3.eth.getBalance(send_account)
        const ethBalance = web3.utils.fromWei(weiBalance, "ether")
        console.log("block : ", result.number, " , balance : ", ethBalance)
    }
};

async function runWs() {
    const provider = web3.currentProvider
    provider.on("connect", () => {
        console.log('provider connected')
    })
    const weiBalance = await web3.eth.getBalance(send_account)
    const ethBalance = web3.utils.fromWei(weiBalance, 'ether')
    console.log("initial balance : ",ethBalance)
    web3.eth.subscribe("newBlockHeaders", newBlockCallback)
}
runWs()

// web3.eth.getTransactionCount(send_account, (err, txCount) => {
//     const txObject = {
//         nonce : web3.utils.toHex(txCount),
//         gasLimit : web3.utils.toHex(1000000),
//         gasPrice : web3.utils.toHex(web3.utils.toWei("10", "gwei")),
//         to : receive_account,
//         value : "0x2C68AF0BB140000", //0.2 -> hexcode
//     }
//
//     const tx = new Tx(txObject)
//     tx.sign(privateKeyBuffer)
//
//     const serializedTx = tx.serialize()
//     const raw = "0x" + serializedTx.toString("hex")
//
//     web3.eth
//         .sendSignedTransaction(raw)
//         .once("transactionHash", hash => {
//             console.info("transactionHash", "https://sepolia.etherscan.io/tx/" + hash)
//         })
//         .once("receipt" , receipt => {
//             console.info("receipt" , receipt)
//         })
//         .on("error", console.error)
// })
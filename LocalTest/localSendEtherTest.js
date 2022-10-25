var Web3 = require("web3")
var fs = require("fs")
var Tx = require("ethereumjs-tx")

var infura_token = fs.readFileSync('./infura_token', "utf8")

// var httpProvider = `https://sepolia.infura.io/v3/${infura_token}`
var httpProvider = new Web3.providers.HttpProvider("http://localhost:7545");
// var wsProvider = `wss://sepolia.infura.io/ws/v3/${infura_token}`

const web3 = new Web3(httpProvider)
// const web3 = new Web3(wsProvider)
var send_private = "607cc01070120c22198467fca73c8c596ed475efccfb5138297118709176c80b"
var receive_private = "c7c59957a4b3af1b85fd4644bd155c968ed2a83208dc8e452e5c9d122ed589ee"

const send_account = "0x39FF9fCC1dF5ed1623cf738dD665c14fe9b2B52f"
const receive_account = "0x5EB09E60Ef0cB6cad8bC66Ce49301932a8E6dAA7"

const send_privateKeyBuffer = Buffer.from(send_private, "hex")
const receivePrivateKeyBuffer = Buffer.from(receive_account, "hex")

web3.eth.getTransactionCount(send_account, (err, txCount) => {
    const txObject = {
        nonce : web3.utils.toHex(txCount),
        gasLimit : web3.utils.toHex(1000000),
        gasPrice : web3.utils.toHex(web3.utils.toWei("10", "gwei")),
        to : send_account,
        value : "0x2C68AF0BB140000", //0.2 -> hexcode
    }

    const tx = new Tx(txObject)
    tx.sign(send_privateKeyBuffer)

    const serializedTx = tx.serialize()
    const raw = "0x" + serializedTx.toString("hex")

    web3.eth
        .sendSignedTransaction(raw)
        .once("transactionHash", hash => {
            console.info("transactionHash", hash)
        })
        .once("receipt" , receipt => {
            console.info("receipt" , receipt)
        })
        .on("error", console.error)
})
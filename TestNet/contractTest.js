const Web3 = require("web3")
const fs = require("fs");
const Tx = require("ethereumjs-tx")

const web3 = new Web3()
const ABI_FILE_TOKEN = JSON.parse(fs.readFileSync('../contract/MyToken/ABI', 'utf-8'))
const contract = new web3.eth.Contract(ABI_FILE_TOKEN);
var private_key = fs.readFileSync('../private_key', "utf8")
const privateKeyBuffer = Buffer.from(private_key, "hex")
// const accounts = await web3.eth.getAccounts();
const functionName = 'transfer';

const makeRawTransaction = async() => {
    const transaction = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(26),
        chainId: 11155111,
        data: contract.methods[functionName](
            "0x9C17C88A4752FBE7A2aA85bAD82651327AF68481",
            10000000000000
        ).encodeABI(),
        value: null,
        gasPrice: "0x3B9ACA00",
        gas: "0x1c9c380"
    }, private_key);


    console.log(transaction);

    const txObject = {
        nonce : web3.utils.toHex(26),
        gasLimit : web3.utils.toHex(1000000),
        gasPrice : web3.utils.toHex(web3.utils.toWei("10", "gwei")),
        to : "0x9C17C88A4752FBE7A2aA85bAD82651327AF68481",
        value : "0x2C68AF0BB140000", //0.2 -> hexcode
    }

    var tx = new Tx(txObject)
    tx.sign(privateKeyBuffer)
    var serializedTx = tx.serialize()

    console.log(web3.utils.toHex(serializedTx))



}

makeRawTransaction()
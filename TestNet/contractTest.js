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
    const contract = new web3.eth.Contract(ABI_FILE_TOKEN)
    const transaction = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(31),
        chainId: 11155111,
        to: "0xF1D5811f73c8D0dbB77f93D67447c06def011446",
        data: contract.methods["transfer"](
            "0x9C17C88A4752FBE7A2aA85bAD82651327AF68481",
            "0x1"
        ).encodeABI(),
        value: null,
        gasPrice: "0x3B9ACA00",
        gas: "0x1c9c380"
    }, private_key);
    console.info("transaction", transaction)
    console.info("raw", transaction.rawTransaction)
}

makeRawTransaction()
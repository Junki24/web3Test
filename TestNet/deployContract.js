
const Web3 = require("web3")
const fs = require("fs");

const ByteCode_File = JSON.parse(fs.readFileSync('../contract/Counter/bytecode', 'utf-8'))
const bytecode = ByteCode_File.object
const ABI_FILE = JSON.parse(fs.readFileSync('../contract/Counter/ABI', 'utf-8'))
var infura_token = fs.readFileSync('../infura_token', "utf8")
var private_key = fs.readFileSync('../private_key', "utf8")
const node_host = `https://sepolia.infura.io/v3/${infura_token}`;

const send_account = "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84"

const web3 = new Web3(node_host);

async function deployContract() {
    const contract = new web3.eth.Contract(ABI_FILE)
    const options = {
        data: "0x" + bytecode,
    }
    const web3Data = contract.deploy(options).encodeABI()
    const transaction = await web3.eth.accounts.signTransaction({
        from: "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84",
        to: null,
        gas: "0x25bd00",
        gasPrice: "0x3316f64f",
        value: null,
        data: web3Data,
        nonce: web3.utils.toHex(1),
        chainId: 1337
    }, private_key)
    return transaction
}

const sendRawTransaction = async() => {
    const deployResult = await deployContract()

    console.info('deployResult', deployResult)

    web3.eth
        .sendSignedTransaction(deployResult.rawTransaction)
        .once("transactionHash", hash => {
            console.info("transactionHash", hash)
        })
        .once("receipt", receipt => {
            console.info("receipt", receipt)
        })
        .once("error", console.error)
}

sendRawTransaction()
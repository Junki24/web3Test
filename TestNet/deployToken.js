const Web3 = require("web3")
const fs = require("fs");

const ByteCode_File = JSON.parse(fs.readFileSync('../contract/MyToken/bytecode', 'utf-8'))
const bytecode = ByteCode_File.object
const ABI_FILE = JSON.parse(fs.readFileSync('../contract/MyToken/ABI', 'utf-8'))
var infura_token = fs.readFileSync('../infura_token', "utf8")
var private_key = fs.readFileSync('../private_key', "utf8")
const node_host = `https://sepolia.infura.io/v3/${infura_token}`;
const wss_provider = `wss://sepolia.infura.io/ws/v3/${infura_token}`

const send_account = "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84"

const web3 = new Web3(wss_provider);

async function deployToken(){
    const tokenContract = new web3.eth.Contract(ABI_FILE)
    const options = {
        data: "0x" + bytecode,
        arguments: ["junkiToken", "JKT"]
    }
    console.info("options", options)
    const web3data = tokenContract.deploy(options).encodeABI()
    const rawTransaction = await web3.eth.accounts.signTransaction({
        from: send_account,
        to: null,
        gas: "0x25bd00",
        gasPrice: "0x3316f64f",
        value: null,
        data: web3data,
        nonce: web3.utils.toHex(12),
        chainId: 11155111
    }, private_key)
    return rawTransaction
}

const sendRawTransaction = async() => {
    const deployResult = await deployToken()

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

// sendRawTransaction()

const tokenContractAddress = '0xF1D5811f73c8D0dbB77f93D67447c06def011446'



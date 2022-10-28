
const Web3 = require("web3")
const fs = require("fs");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const ByteCode_File = JSON.parse(fs.readFileSync('../contract/Counter/bytecode', 'utf-8'))
const bytecode = ByteCode_File.object
const ABI_FILE = JSON.parse(fs.readFileSync('../contract/Counter/ABI', 'utf-8'))
const ABI_FILE_TOKEN = JSON.parse(fs.readFileSync('../contract/MyToken/ABI', 'utf-8'))
var infura_token = fs.readFileSync('../infura_token', "utf8")
var private_key = fs.readFileSync('../private_key', "utf8")
const node_host = `https://sepolia.infura.io/v3/${infura_token}`;
const wss_provider = `wss://sepolia.infura.io/ws/v3/${infura_token}`
const hd_provider = new HDWalletProvider(private_key, wss_provider, 0, 0)
const send_account = "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84"
const receive_account = "0x9C17C88A4752FBE7A2aA85bAD82651327AF68481"

const web3 = new Web3(hd_provider);

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
        nonce: web3.utils.toHex(23),
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

const counterContractAddress = '0x35e234c4D4B9c1D4ccedd6946284CFF28d334900'
const erc20TokenAddress = '0xF1D5811f73c8D0dbB77f93D67447c06def011446'

const myContract = new web3.eth.Contract(ABI_FILE_TOKEN, erc20TokenAddress)

const testCount = async() => {
    try {
        // console.log(myContract.methods)
        // console.log(myContract.methods.incrementCount('hjihi'))


        web3.eth
            .sendSignedTransaction("0xf86d1a8502540be400830f4240949c17c88a4752fbe7a2aa85bad82651327af684818802c68af0bb140000801ba033bad3778da0158152727c7d296e68ea420bf51df75304802ad72dc5478af20aa0010e24ee6f956955fc6f75566cc94de48569e9d49da2c5e4223cb36831c8e2f2")
            .once("transactionHash", hash => {
                console.info("transactionHash", "https://sepolia.etherscan.io/tx/" + hash)
            })
            .once("receipt" , receipt => {
                console.info("receipt" , receipt)
            })
            .on("error", console.error)

        // const countResult = await myContract.methods.count().call()
        // console.log(countResult)
        const event = (
            await myContract.getPastEvents("Transfer", {
                fromBlock: "latest",
            })
        )

        console.info("event", event)

    }catch (e) {
        console.log(e);
        return false;
    }
}

testCount()
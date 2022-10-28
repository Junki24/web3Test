var Web3 = require("web3")
const httpProvider = new Web3.providers.HttpProvider("http://localhost:7545");
const wsProvider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
const web3 = new Web3(wsProvider)
const Tx = require("ethereumjs-tx")
const fs = require("fs");

const account1 = '0x39FF9fCC1dF5ed1623cf738dD665c14fe9b2B52f'
const account2 = '0x5EB09E60Ef0cB6cad8bC66Ce49301932a8E6dAA7'
const account3 = '0x9300d2B85C40e42Ae1870f7B2842e86A30aBce81'
const account4 = '0x5D3f8B7c319f56ca13732557A8e547B8fD073657'
const account5 = '0xb3A970F57F26e927Df97Daf63AA0FA0929335cFd'

const private1 = '607cc01070120c22198467fca73c8c596ed475efccfb5138297118709176c80b'
const private2 = 'c7c59957a4b3af1b85fd4644bd155c968ed2a83208dc8e452e5c9d122ed589ee'
const private3 = '26c8e3a0553b8c15cb96cd0ed9b547161abd1436c8f9cdd80554ffa3284ef439'
const private4 = '07bf00afd56e3ca65fef01b656c664c360e899d0861d57002559f23e5714277b'
const private5 = 'df57589d3d2b5f16c945c56d4fcb378c4b39b87f0789e542aa949d70856367a1'

const ByteCode_File = JSON.parse(fs.readFileSync('../contract/Counter/bytecode', 'utf-8'))
const bytecode = ByteCode_File.object
const ABI_FILE = JSON.parse(fs.readFileSync('../contract/Counter/ABI', 'utf-8'))
const counterContractAddress = '0x3aF060521e16464Ec565c7608073bf08FF7DD652'

const privateKeyBuffer = Buffer.from(private1, "hex")

async function deployContract() {
    const contract = new web3.eth.Contract(ABI_FILE);
    const options = {
        data: '0x' + bytecode,
    }
    const web3Data = contract.deploy(options).encodeABI();
    const transaction = await web3.eth.accounts.signTransaction({
        from: "0x39FF9fCC1dF5ed1623cf738dD665c14fe9b2B52f",
        to: null,
        gas: "0x25bd00",
        gasPrice: "0x3316f64f",
        value: null,
        data: web3Data,
        nonce: web3.utils.toHex(18),
        chainId: 1337
    }, private1);
    return transaction;
}

const sendRawTransaction = async() => {
    const deployResult = await deployContract()

    web3.eth
        .sendSignedTransaction(deployResult.rawTransaction)
        .once("transactionHash", hash => {
            console.info("transactionHash", hash)
        })
        .once("receipt" , receipt => {
            console.info("receipt" , receipt)
        })
        .on("error", console.error)
}

// sendRawTransaction()
//

const myContract = new web3.eth.Contract(ABI_FILE, counterContractAddress)

const testCount = async() => {
    try {
        await myContract.methods.incrementCount().send({
            value: 0,
            from: account1,
            gasLimit: 2000000,
        })

        const countResult = await myContract.methods.count().call()
        console.log(countResult)
    }catch (e) {
        console.log(e);
        return false;
    }
} 

testCount()

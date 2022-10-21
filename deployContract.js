
const Web3 = require("web3")
const fs = require("fs");

const ByteCode_File = JSON.parse(fs.readFileSync('./contract/HelloWorld/bytecode', 'utf-8'))
const ABI_FILE = JSON.parse(fs.readFileSync('./contract/HelloWorld/ABI', 'utf-8'))
var infura_token = fs.readFileSync('./infura_token', "utf8")
var private_key = fs.readFileSync('./private_key', "utf8")
const node_host = `https://sepolia.infura.io/v3/${infura_token}`;

const send_account = "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84"

const web3 = new Web3(node_host);

const MyContract = new web3.eth.Contract(ABI_FILE);

web3.eth.personal.unlockAccount(send_account, private_key, 10000).then(console.log("Account unlock"))

const deploy = MyContract.deploy({
    data : web3.utils.toHex(ByteCode_File)
}).send({
    from : web3.utils.toHex(send_account),
    gas : web3.utils.toHex(1000000),
    gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
}, (err, transactionHash) => {
  console.info("transactionHash", "https://sepolia.etherscan.io/tx/" + transactionHash)
}).on('error', (error) => {
    console.error('error', error)
}).on('transactionHash', (transactionHash) => {
    console.info('transactionHash', transactionHash)
}).on('receipt', (receipt)=> {
    console.info('receipt', receipt)
}).then((newContractInstance) => {
    console.info('newContractInstance', newContractInstance)
})
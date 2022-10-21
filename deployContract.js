
const Web3 = require("web3")
const fs = require("fs");

const ByteCode_File = JSON.parse(fs.readFileSync('./contract/HelloWorld/bytecode', 'utf-8'))
const bytecode = ByteCode_File.object
const ABI_FILE = JSON.parse(fs.readFileSync('./contract/HelloWorld/ABI', 'utf-8'))
var infura_token = fs.readFileSync('./infura_token', "utf8")
var private_key = fs.readFileSync('./private_key', "utf8")
const node_host = `https://sepolia.infura.io/v3/${infura_token}`;

const send_account = "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84"

const web3 = new Web3(node_host);

const Web3 = require("web3")
const ethers = require("ethers")
const axios = require("axios")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const {zeroPadBytes} = require("../eth_util/message");
const {stringToBytes32} = require("../eth_util/converter");
const {signAndEncodeMessage} = require("../eth_util/message");
const {formatNetChainId} = require("../eth_util/eth_converter");
const {formatAddress} = require("../eth_util/eth_converter");
const ethRevertReason = require("eth-revert-reason")
const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');
const {formatAmount} = require("../eth_util/message");

const sepoliaNetwork = 'https://mainnet.infura.io/v3/6071e0647e68494f9a7ca7c80acaf420'
const user1Address = '0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84'
const user2Address = '0x9C17C88A4752FBE7A2aA85bAD82651327AF68481'
const user1PrivateKeys = "f657ce89a12985f8e9a3db5a2ee4eea097b6059fc5b4a6b8bfe23b5ac05153a0"
const user2PrivateKeys = "66564cf842f1add1f04d6ecece82592a137f65b69786065e1367a2c487acb2e5"
const mnemonic = "dinner ecology diamond omit gadget client undo crunch fury lava capital reject"

const ONE_ETHER  = ethers.utils.parseEther("0.01")

const provider = new HDWalletProvider(
    {
        mnemonic : {
            phrase : mnemonic
        },
        providerOrUrl : sepoliaNetwork
    }
)

const web3 = new Web3(provider)
web3.eth.handleRevert=true

const user1 = {
    address: user1Address,
    privateKey: user1PrivateKeys
}

const user2 = {
    address: user2Address,
    privateKey: user2PrivateKeys
}

const user3 = {
    address: '0x6419E0ece2CC9265CB9Ddc3849617AA49750Efea',
    privateKey: '0x7adbd329d1d9eb2cf81173010ff65cb46ee1588698e4272ace3dfad7f56387f9'
}

const signer1PK = ""
const signer2PK = ""

const testSigners = [signer1PK, signer2PK]

const abiCode = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "previousAdmin",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "newAdmin",
                "type": "address"
            }
        ],
        "name": "AdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "beacon",
                "type": "address"
            }
        ],
        "name": "BeaconUpgraded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originNetChainId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originTokenContract",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "wrappedContract",
                "type": "address"
            }
        ],
        "name": "CreateAndRegisterWrapped",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "isWrapped",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "netChainId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originTokenContract",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            }
        ],
        "name": "RegisterAsset",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originNetChainId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "gatewayContractAddress",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "messageHash",
                "type": "bytes32"
            }
        ],
        "name": "RegisterGateway",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originNetChainId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originTokenContract",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "wrappedContract",
                "type": "address"
            }
        ],
        "name": "RegisterWrapped",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originNetChainId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originTxHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            }
        ],
        "name": "Unwrap",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address[]",
                "name": "signers",
                "type": "address[]"
            }
        ],
        "name": "UpdateSigners",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "implementation",
                "type": "address"
            }
        ],
        "name": "Upgraded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "originNetChainId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "targetNetChainId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "recipient",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "Wrap",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "coin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "netChainId_",
                "type": "bytes32"
            }
        ],
        "name": "gatewayContract",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "netChainId_",
                "type": "bytes32"
            },
            {
                "internalType": "address[]",
                "name": "signers_",
                "type": "address[]"
            },
            {
                "internalType": "bytes32[]",
                "name": "gatewayContracts",
                "type": "bytes32[]"
            },
            {
                "internalType": "uint256",
                "name": "signerFee",
                "type": "uint256"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "isUsed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "asset",
                "type": "address"
            }
        ],
        "name": "isWrapped",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            }
        ],
        "name": "lockedAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "netChainId",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token_",
                "type": "address"
            }
        ],
        "name": "originNetChainId",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token_",
                "type": "address"
            }
        ],
        "name": "originTokenContract",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "proxiableUUID",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "signerFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "signers",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newImplementation",
                "type": "address"
            }
        ],
        "name": "upgradeTo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newImplementation",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "upgradeToAndCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "netChainId_",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "originTokenContract_",
                "type": "bytes32"
            }
        ],
        "name": "wrappedAsset",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "message",
                "type": "bytes"
            }
        ],
        "name": "registerGateway",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "message",
                "type": "bytes"
            }
        ],
        "name": "registerAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "message",
                "type": "bytes"
            }
        ],
        "name": "createAndRegisterWrappedAsset",
        "outputs": [
            {
                "internalType": "address",
                "name": "wrapped",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "message",
                "type": "bytes"
            }
        ],
        "name": "updateSigners",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "targetNetChainId",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "recipient",
                "type": "string"
            }
        ],
        "name": "wrap",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "message",
                "type": "bytes"
            }
        ],
        "name": "unwrap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const erc20AbiCode = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name_",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol_",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burnFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account_",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount_",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const sepoliaNetworkId = 1
const sepoliaChainId = 1

const sepoliaNetChainId = formatNetChainId(sepoliaNetworkId, sepoliaChainId)

const VOT = '0xe87d4abb3de3ff0f5bf251b74683b2f5eb381875'

async function createAccount() {
    console.log(web3.eth.accounts.create(web3.utils.randomHex(32)));
}

async function createTransaction() {
    const contract = new web3.eth.Contract(erc20AbiCode)
    const functionName = 'transfer'
    console.log(ONE_ETHER)

    const transaction = await web3.eth.accounts.signTransaction({
        nonce: "0x1",
        chainId: 2022,
        to: VOT,
        data: contract.methods[functionName](
            "0xdeC1DA2188098f7151d261c23dC63e6a96933300",
            "0x1"
        ).encodeABI(),
        value: null,
        gasPrice: "0x3B9ACA00",
        gas: "0x1c9c380"
    }, user1.privateKey)

    // console.info("transaction",transaction)
    // parseRawTransaction(transaction.rawTransaction, abiCode, functionName);
    const account = await web3.eth.getAccounts()

    console.log(account)
    for(let i = 0; i< account.length;i++){
        console.log(account[i])
        console.info("pk", web3.utils.fromWei(await web3.eth.getBalance(account[i]),"ether"))
    }
    // gasPrice
    // console.log(web3.utils.hexToNumber("0x3B9ACA00"))
    //gas
    // console.log(web3.utils.hexToNumber("0x1c9c380"))
}

async function getBalance() {
    const token = new web3.eth.Contract(erc20AbiCode, VOT);

    // console.log(token);
    console.log('hihi');
    const balance = await token.methods.balanceOf(
        "0xdeC1DA2188098f7151d261c23dC63e6a96933300"
    ).encodeABI();
    console.log('byebye');
    // 200000000000000000000000000
    console.log(balance)
}


// createTransaction()
// createAccount()
// getBalance()
createTransaction()
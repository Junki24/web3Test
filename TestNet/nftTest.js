const Web3 = require("web3")
const fs = require("fs")
const Tx = require("ethereumjs-tx")
const etherscanApi = require("etherscan-api").init('MCFJUDXVIXRTB6KVZAHR4Q7BKCP5E15GKV', 'sepolia', 3000)
const ethers = require("ethers");

const infura_token = fs.readFileSync('../infura_token', "utf8")
const private_key = fs.readFileSync('../private_key', "utf8")
const httpProvider = `https://sepolia.infura.io/v3/${infura_token}`
const wsProvider = `wss://sepolia.infura.io/ws/v3/${infura_token}`

const ByteCode_File = JSON.parse(fs.readFileSync('../contract/NFT/bytecode', 'utf-8'))
const bytecode = ByteCode_File.object
const abi = JSON.parse(fs.readFileSync('../contract/NFT/ABI', 'utf-8'))

// const web3 = new Web3(httpProvider)
const web3 = new Web3(wsProvider)
const nftContract = new web3.eth.Contract(abi)

const send_account = "0x4f71a6C4C147661DAfE3F161A0Eb704107f3dD84"
const receive_account = "0x9C17C88A4752FBE7A2aA85bAD82651327AF68481"

const nftContractAddress = '0x5dFb3c22Fd5a52eCFe287E0cB8a206B46Cc69fba'

const mintEther = ethers.utils.parseEther("0.08")

const privateKeyBuffer = Buffer.from(private_key, "hex")

async function deployNftContract (nonce) {
    const options = {
        data: "0x" + bytecode,
    }

    const web3data = nftContract.deploy(options).encodeABI()
    const rawTransaction = await web3.eth.accounts.signTransaction({
        from: send_account,
        to: null,
        gas: "0xffffff",
        gasPrice: "0x3316f64f",
        value: null,
        data: web3data,
        nonce: web3.utils.toHex(nonce),
        chainId: 11155111
    }, private_key)

    return web3.eth.sendSignedTransaction(rawTransaction.rawTransaction);
}

async function setUriNft(nonce) {
    const web3Data = nftContract.methods['setBaseTokenURI'](
        'https://bafybeibidmaemhi3kl4qnmu2fbvwvocghztdsvt6icjkvjvobjx7sgjpvu.ipfs.nftstorage.link/metadata/'
    ).encodeABI()

    const rawTransaction = await web3.eth.accounts.signTransaction({
        from: send_account,
        to: nftContractAddress,
        gas: "0x25bd00",
        gasPrice: "0x3316f64f",
        value: null,
        data: web3Data,
        nonce: web3.utils.toHex(nonce),
        chainId: 11155111
    }, private_key)

    return web3.eth.sendSignedTransaction(rawTransaction.rawTransaction)
}

async function mint(nonce, address) {
    const web3Data = nftContract.methods['mintTo'](
        address
    ).encodeABI()

    const rawTransaction = await web3.eth.accounts.signTransaction({
        from: send_account,
        to: nftContractAddress,
        gas: "0x25bd00",
        gasPrice: "0x3316f64f",
        value: mintEther,
        data: web3Data,
        nonce: web3.utils.toHex(nonce),
        chainId: 11155111
    }, private_key)

    return web3.eth.sendSignedTransaction(rawTransaction.rawTransaction)
}

async function callTokenInfo(tokenId){
    const myNftContract = new web3.eth.Contract(abi, nftContractAddress)
    const tokenInfo = await myNftContract.methods['tokenURI'](tokenId).call()
    const metadata = await fetch(tokenInfo).then((res) => res.json())
    return JSON.stringify(metadata)
}

async function callBaseUri(){
    const myNftContract = new web3.eth.Contract(abi, nftContractAddress)
    return await myNftContract.methods['baseTokenURI']().call()
}

async function balanceOfNft(address){
    const myNftContract = new web3.eth.Contract(abi, nftContractAddress)
    return await myNftContract.methods['balanceOf'](address).call()
}

async function withdraw(nonce, address) {
    const web3Data = nftContract.methods['withdrawPayments'](address).encodeABI()

    const rawTransaction = await web3.eth.accounts.signTransaction({
        from: send_account,
        to: nftContractAddress,
        gas: "0x25bd00",
        gasPrice: "0x3316f64f",
        value: null,
        data: web3Data,
        nonce: web3.utils.toHex(nonce),
        chainId: 11155111
    }, private_key)

    return await web3.eth.sendSignedTransaction(rawTransaction.rawTransaction)
}

async function test(){
    try{
        const nonce = await web3.eth.getTransactionCount(send_account)
        // const deployResult = await deployNftContract(nonce)
        // console.log("deployResult", deployResult)
        // const setUriResult = await setUriNft(nonce)
        // console.log("setUriResult", setUriResult)
        // const mintResult = await mint(nonce, send_account)
        // console.log("mintResult", mintResult)
        // const callTokenResult = await callTokenInfo(2)
        // console.log(callTokenResult)
        // const callBaseUriResult = await callBaseUri()
        // console.log(callBaseUriResult)
        // const balanceOfNftResult = await balanceOfNft(receive_account)
        // console.log(balanceOfNftResult)
        // const withdrawResult = await withdraw(nonce,send_account)
        // console.log(withdrawResult)
    }catch(e){
        console.error(e)
    }
}

test()
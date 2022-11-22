const Web3 = require("web3")
const Tx = require("ethereumjs-tx")
const fs = require("fs");
const web3 = new Web3()

const privateKeyToAccount = async() => {
    //eth
    //pkResult {
    //   address: '0x7726cbBFB7ba9A4Fb1eA48A2906e786549369D96',
    //   privateKey: '0x24e64f8790b65e36f3aaf2d89c0561067dea6096f7912856cade2b0c6268a942',
    //   signTransaction: [Function: signTransaction],
    //   sign: [Function: sign],
    //   encrypt: [Function: encrypt]
    // }
    const pkResult = web3.eth.accounts.privateKeyToAccount('0x24e64f8790b65e36f3aaf2d89c0561067dea6096f7912856cade2b0c6268a942')

    console.info("pkResult", pkResult)

    // const txObject = {
    //     nonce : web3.utils.toHex(10),
    //     gasLimit : web3.utils.toHex(1000000),
    //     gasPrice : web3.utils.toHex(web3.utils.toWei("10", "gwei")),
    //     to : "0xe7c6381565dD8c9e98a8FD4a275Ed75BcAc2a63b",
    //     value : web3.utils.toHex(10), //0.2 -> hexcode
    // }
    // //sender = '0x358c0027e9630bCe275c7127D0F6397e054d3760' at this key
    // const privateKey = '0x4590ec7813f6bc9acfe312bc265a39f6741878a3ef716d5de9b9a870b75cbcae'
    // const privateKeyBuffer = Buffer.from(privateKey, "hex")
    // console.info("privateKeyBuffer", privateKeyBuffer.length)
    //
    // const tx = new Tx(txObject)
    // tx.sign(privateKeyBuffer)
    // const serializedTx = tx.serialize()
    // const raw = "0x" + serializedTx.toString("hex")
    //
    // console.info("raw", raw)
    // return raw
    // const ABI_FILE_TOKEN = JSON.parse(fs.readFileSync('../contract/MyToken/ABI', 'utf-8'))
    // const contract = new web3.eth.Contract(ABI_FILE_TOKEN);
    // // const accounts = await web3.eth.getAccounts();
    // const functionName = 'transfer';
    //
    // const transaction = await web3.eth.accounts.signTransaction({
    //     nonce: "0x1",
    //     chainId: 2022,
    //     to: "0xe7c6381565dD8c9e98a8FD4a275Ed75BcAc2a63b",
    //     data: contract.methods[functionName](
    //         "0xdeC1DA2188098f7151d261c23dC63e6a96933300",
    //         "0x1"
    //     ).encodeABI(),
    //     value: null,
    //     gasPrice: "0x3B9ACA00",
    //     gas: "0x1c9c380"
    // }, '0x4590ec7813f6bc9acfe312bc265a39f6741878a3ef716d5de9b9a870b75cbcae');
    // console.log(transaction)
}

privateKeyToAccount();

//1
//{
//   address: '0x358c0027e9630bCe275c7127D0F6397e054d3760',
//   privateKey: '0x4590ec7813f6bc9acfe312bc265a39f6741878a3ef716d5de9b9a870b75cbcae',
//   signTransaction: [Function: signTransaction],
//   sign: [Function: sign],
//   encrypt: [Function: encrypt]
// }

// 2
// {
//     address: '0xeb4b63027551C68232d9962611F20F12AafCD6bB',
//     privateKey: '0x083490f34ad1c4f135a5efc9e25bed2dc4fb4cf9e823ee93ce7e9ee90398ddd6',
//     signTransaction: [Function: signTransaction],
//     sign: [Function: sign],
//     encrypt: [Function: encrypt]
// }

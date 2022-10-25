var Web3 = require("web3")
const httpProvider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(httpProvider)

const send_account = '0x39FF9fCC1dF5ed1623cf738dD665c14fe9b2B52f'
const receive_account = '0x5EB09E60Ef0cB6cad8bC66Ce49301932a8E6dAA7'
const account3 = '0x9300d2B85C40e42Ae1870f7B2842e86A30aBce81'
const account4 = '0x5D3f8B7c319f56ca13732557A8e547B8fD073657'
const account5 = '0xb3A970F57F26e927Df97Daf63AA0FA0929335cFd'

const balances = async() => {
    const balanceSend = web3.utils.fromWei(await web3.eth.getBalance(send_account), 'ether')
    const balanceReceive = web3.utils.fromWei(await web3.eth.getBalance(receive_account), 'ether')

    console.log(`the balance of ${send_account} is ${balanceSend} ETH`)
    console.log(`the balance of ${receive_account} is ${balanceReceive} ETH`)
};

balances()
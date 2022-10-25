const jsonfile = require("jsonfile");
const {deployProxy, upgradeProxy} = require('@openzeppelin/truffle-upgrades');

const {
    signAndEncodeMessage,
    zeroPadBytes,
    formatAmount,
} = require("../utils/message");
const truffleAssert = require("truffle-assertions");
const {ethers} = require("ethers");
const {formatNetChainId, formatAddress, parseNetworkId, parseChainId} = require("../utils/eth_converter");

const GatewayV1 = artifacts.require("GatewayV1");
const TokenV1 = artifacts.require("TokenV1");

const GatewayV1ABI = jsonfile.readFileSync(
    "build/contracts/GatewayV1.json"
).abi;

const signer1PK =
    "cfb12303a19cde580bb4dd771639b0d26bc68353645571a8cff516ab2ee113a0";
const signer2PK =
    "892330666a850761e7370376430bb8c2aa1494072d3bfeaed0c4fa3d5a9135fe";

const testSigners = [signer1PK, signer2PK];
const signer1 = web3.eth.accounts.privateKeyToAccount(signer1PK).address;
const signer2 = web3.eth.accounts.privateKeyToAccount(signer2PK).address;

const signer3PK =
    "0c8c11f5aedf5f838dbe04f0c4f78c7f65354c8a6f705f97cea8524aa5ce7783";
const signer4PK =
    "2895d813d8ab90df7e735eb3e0c0ae1485b4b518777000d80b50c18dc5253311";


const yourNetworkId = 2022;
const yourChainId = 2023;

const ethNetworkId = 2024;
const ethChainId = 2025;

const yourNetChainId = formatNetChainId(yourNetworkId, yourChainId);
const myNetChainId = formatNetChainId(ethNetworkId, ethChainId);



const ONE_ETHER  = ethers.utils.parseEther("1")
contract("GatewayV1", function (accounts) {
    let gateway;
    let deployer = accounts[0]

    //상대방 게이트웨이 컨트랙트 주소
    const yourGatewayAddress = "0x888344e9dc9BcD988C1e6040D8AE008F53e7B1e7";
    const yourFormattedGatewayAddress = formatAddress(yourGatewayAddress);

    //상대방 토큰 컨트랙트 주소
    const OriginToken = "0xC1762Ff4406330CAeeF8A8a189947E27b0B87341";
    const formattedTokenAddress = formatAddress(OriginToken);

    const initialGateway = [
        yourNetChainId, yourFormattedGatewayAddress
    ]

    const recipient = formatAddress(accounts[1]);
    // build up and tear down a new Casino contract before each test
    beforeEach(async () => {
        gateway = await deployProxy(GatewayV1, [
            myNetChainId,
            [signer1, signer2],
            initialGateway,
            0,
        ]);
    });

    it("should be initialized correctly", async function () {
        const _netChainId = await gateway.netChainId();
        const networkId = parseNetworkId(_netChainId);
        const chainId = parseChainId(_netChainId);
        assert.equal(networkId, ethNetworkId);
        assert.equal(chainId, ethChainId);

        const signers = await gateway.signers();
        assert.equal(
            signers[0],
            web3.eth.accounts.privateKeyToAccount(signer1PK).address
        );
        assert.equal(
            signers[1],
            web3.eth.accounts.privateKeyToAccount(signer2PK).address
        );
    });

    it("should register gateway", async function () {
        const payload =
            myNetChainId.substring(2) +
            yourNetChainId.substring(2) +
            yourFormattedGatewayAddress.substring(2);

        const message = await signAndEncodeMessage(testSigners, 11, payload);
        const tx = await gateway.registerGateway(message)
        truffleAssert.eventEmitted(tx, 'RegisterGateway', (ev) => {
            console.log(ev)
            return true
        });
    });

    it("should handle wrap Coin correctly", async function () {
        const balanceBefore = await web3.eth.getBalance(gateway.address)
        const tx = await gateway.wrap(
            ethers.utils.getAddress("0x0000000000000000000000000000000000000001"),
            ONE_ETHER,
            yourNetChainId,
            recipient,
            {
                value: ONE_ETHER,
                from: deployer
            }
        )

        const balanceAfter = await web3.eth.getBalance(gateway.address)
        assert(balanceBefore , 0)
        assert(balanceAfter , ONE_ETHER)
        truffleAssert.eventEmitted(tx, 'Wrap', (ev) => {
            console.log(ev)
            console.log(myNetChainId)
            console.log(yourNetChainId)
            console.log(recipient)
            return (
                ev.originNetChainId === myNetChainId &&
                ev.targetNetChainId === yourNetChainId &&
                ev.tokenContract === ethers.utils.getAddress("0x0000000000000000000000000000000000000001") &&
                ev.recipient === recipient)
        });
    });

    // it("unwrap wrapped Coin", async function () {
    //   const originalAmount = 300;
    //
    //   const tokenRecipient =
    //     web3.eth.accounts.privateKeyToAccount(signer1PK).address;
    //
    //   const createWrappedEvent = (
    //     await gateway.getPastEvents("CreateAndRegisterWrapped", {
    //       fromBlock: 0,
    //     })
    //   )[0].returnValues;
    //   const { wrappedContract } = createWrappedEvent;
    //   const token = new web3.eth.Contract(TokenV1.abi, wrappedContract);
    //   const balanceBefore = await token.methods.balanceOf(tokenRecipient).call();
    //   assert.equal(balanceBefore, "0");
    //
    //   const payload =
    //     ethNetChainId.substring(2) +
    //     netChainId.substring(2) +
    //     eqbrTxHash +
    //     formattedGatewayAddress.substring(2) +
    //     formattedTokenAddress.substring(2) +
    //     formatAmount(originalAmount) +
    //     zeroPadBytes(tokenRecipient.substring(2), 32);
    //
    //   const gatewayAddress = await gateway.methods.gatewayContract(netChainId).call();
    //
    //   const message = await signAndEncodeMessage(testSigners, 11, payload);
    //   await gateway.methods.unwrap(message).send({
    //     value: 0,
    //     from: accounts[0],
    //     gasLimit: 2000000,
    //   });
    //
    //   const event = (
    //     await gateway.getPastEvents("Unwrap", {
    //       fromBlock: "latest",
    //     })
    //   )[0].returnValues;
    //   const { tokenContract, amount, recipient } = event;
    //
    //   const balanceAfter = await token.methods.balanceOf(tokenRecipient).call();
    //
    //   assert.equal(tokenRecipient, recipient);
    //   assert.equal(wrappedContract, tokenContract);
    //   assert.equal(balanceAfter, amount);
    // })
    //
    // it("should handle updateSigners correctly", async function () {
    //   const gateway = new web3.eth.Contract(GatewayV1ABI, GatewayV1.address);
    //   const accounts = await web3.eth.getAccounts();
    //
    //   const address1 = web3.eth.accounts.privateKeyToAccount(signer3PK).address;
    //   const address2 = web3.eth.accounts.privateKeyToAccount(signer4PK).address;
    //   const payload =
    //     ethNetChainId.substring(2) +
    //     "02" +
    //     zeroPadBytes(address1.substring(2), 32) +
    //     zeroPadBytes(address2.substring(2), 32);
    //
    //   const message = await signAndEncodeMessage(testSigners, 11, payload);
    //   await gateway.methods.updateSigners(message).send({
    //     value: 0,
    //     from: accounts[0],
    //     gasLimit: 2000000,
    //   });
    //
    //   const updateSignersEvent = (
    //     await gateway.getPastEvents("UpdateSigners", {
    //       fromBlock: "latest",
    //     })
    //   )[0].returnValues;
    //
    //   const message2 = await signAndEncodeMessage(
    //     [signer3PK, signer4PK],
    //     12,
    //     payload
    //   );
    //   await gateway.methods.updateSigners(message2).send({
    //     value: 0,
    //     from: accounts[0],
    //     gasLimit: 2000000,
    //   });
    // });
});

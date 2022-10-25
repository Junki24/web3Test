const ethers = require("ethers");

// converts EQBR network id, chain id to concatenated bytes32 format
function formatNetChainId(networkId, chainId) {
  const nId = NumberToBytes16(networkId);
  const cId = NumberToBytes16(chainId);
  return ethers.utils.hexConcat([nId, cId]);
}

function NumberToBytes16(number) {
  return ethers.utils.hexlify(
    ethers.utils.zeroPad(number, 16)
  );
}

function parseNetworkId(bytes) {
  const networkId = ethers.utils.hexStripZeros("0x" + bytes.substr(2, 32));
  return parseInt(networkId)
}

function parseChainId(bytes) {
  const chainId = ethers.utils.hexStripZeros("0x" + bytes.substr(34, 32));
  return parseInt(chainId)
}

// converts ethereum account address to bytes32 format
function formatAddress(address) {
  if (address.length !== 42) throw new Error("address length is mismatched");
  return ethers.utils.hexlify( ethers.utils.zeroPad(address, 32));
}

function parseAddress(bytes) {
  return "0x" + bytes.substr(26);
}


module.exports = {
  formatNetChainId,
  parseNetworkId,
  parseChainId,
  formatAddress,
  parseAddress
};

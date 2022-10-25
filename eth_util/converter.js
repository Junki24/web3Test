const ethers = require("ethers");

// converts EQBR network id, chain id to concatenated bytes32 format
function formatEqbrNetChainId(networkId, chainId) {
  const nId = stringToBytes16(networkId);
  const cId = stringToBytes16(chainId);
  return ethers.utils.hexConcat([nId, cId]);
}

function stringToBytes16(str) {
  return ethers.utils.hexlify(
    ethers.utils.zeroPad(ethers.utils.toUtf8Bytes(str), 16)
  );
}

function stringToBytes32(str) {
  return ethers.utils.hexlify(
    ethers.utils.zeroPad(ethers.utils.toUtf8Bytes(str), 32)
  );
}

function parseNetworkId(bytes) {
  const networkId = ethers.utils.hexStripZeros("0x" + bytes.substr(2, 32));
  return ethers.utils.toUtf8String(networkId);
}

function parseChainId(bytes) {
  const chainId = ethers.utils.hexStripZeros("0x" + bytes.substr(34, 32));
  return ethers.utils.toUtf8String(chainId);
}

// converts EQBR account address to bytes32 format
// removes prefix "0x1k" and add zero pad
function formatEqbrAddress(address) {
  if (address.length !== 48) throw new Error("address length is mismatched");
  const contentAfterPrefix = "0x" + address.slice(4);
  const zero10byte = ethers.utils.hexZeroPad("0x0", 10);
  return ethers.utils.hexConcat([zero10byte, contentAfterPrefix]);
}

function parseEqbrAddress(bytes) {
  return "0x1k" + bytes.substr(22);
}

function parseEqbrContractAddress(bytes) {
  return "0x00" + bytes.substr(22);
}

module.exports = {
  formatEqbrNetChainId,
  parseNetworkId,
  parseChainId,
  formatEqbrAddress,
  parseEqbrAddress,
  parseEqbrContractAddress,
  stringToBytes32
};

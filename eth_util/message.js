const abi = require("web3-eth-abi");
const utils = require("web3-utils");
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();

async function signAndEncodeMessage2(signers, nonce, payload) {
    const body = [
        abi.encodeParameter("uint32", nonce).substring(2 + (64 - 8)),
        payload,
    ];
    const hash = utils.soliditySha3(utils.soliditySha3("0x" + body.join("")));

    let sigs = "";
    for (let i in signers) {
        const ec = new elliptic.ec("secp256k1");
        const key = ec.keyFromPrivate(signers[i]);
        const signature = key.sign(hash.substring(2), {canonical: true});
        const packed = [
            abi.encodeParameter("uint8", i).substring(2 + (64 - 2)),
            // fix length to 32
            zeroPadBytes(signature.r.toString(16), 32),
            zeroPadBytes(signature.s.toString(16), 32),
            abi
                .encodeParameter("uint8", signature.recoveryParam)
                .substring(2 + (64 - 2)),
        ];
        sigs += packed.join("");
    }

    const sigLen = abi
        .encodeParameter("uint8", signers.length)
        .substring(2 + (64 - 2));

    const message = [sigLen, sigs, body.join("")].join("");
    return "0x" + message;
}

async function signAndEncodeMessage(signers, nonce, payload) {

    const body = [
        abi.encodeParameter("uint32", nonce).substring(2 + (64 - 8)),
        payload,
    ];

    const hash = utils.soliditySha3(utils.soliditySha3("0x" + body.join("")));
    let sigs = "";
    for (let i in signers) {
        const signature = accounts.sign(hash, signers[i]);


        const parsedSign = {
            messageHash: signature.message,
            v: parseInt(signature.v) - 27,
            r: signature.r.substring(2),
            s: signature.s.substring(2)
        }

        console.log("signature", parsedSign);

        const packed = [
            abi.encodeParameter("uint8", i).substring(2 + (64 - 2)),
            // fix length to 32
            zeroPadBytes(parsedSign.r, 32),
            zeroPadBytes(parsedSign.s, 32),
            abi
                .encodeParameter("uint8", parsedSign.v)
                .substring(2 + (64 - 2)),
        ];
        sigs += packed.join("");
    }

    const sigLen = abi
        .encodeParameter("uint8", signers.length)
        .substring(2 + (64 - 2));

    const message = [sigLen, sigs, body.join("")].join("");
    return "0x" + message;
}

function zeroPadBytes(value, length) {
    while (value.length < 2 * length) {
        value = "0" + value;
    }
    return value;
}

function formatAmount(amount) {
    return zeroPadBytes(utils.fromDecimal(amount).substring(2), 32);
}

function encodeMessage(signatures, nonce, payload) {
    let sigs = "";
    const body = [
        abi.encodeParameter("uint32", nonce).substring(2 + (64 - 8)),
        payload,
    ];

    for (let i in signatures) {
        const packed = [
            abi.encodeParameter("uint8", i).substring(2 + (64 - 2)),
            // fix length to 32
            zeroPadBytes(signatures[i].r, 32),
            zeroPadBytes(signature[i].s, 32),
            abi
                .encodeParameter("uint8", signatures[i].recoveryParam)
                .substring(2 + (64 - 2)),
        ];
        sigs += packed.join("");
    }
    const sigLen = abi
        .encodeParameter("uint8", signatures.length)
        .substring(2 + (64 - 2));

    const message = [sigLen, sigs, body.join("")].join("");
    return "0x" + message;
}

module.exports = {
    signAndEncodeMessage,
    zeroPadBytes,
    formatAmount,
    encodeMessage
};


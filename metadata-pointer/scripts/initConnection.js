const { Connection, clusterApiUrl, Keypair } = require("@solana/web3.js");
const os = require("os");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

module.exports = { connection, payer };

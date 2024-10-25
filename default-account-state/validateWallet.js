// The DefaultAccountState extension introduces a valuable tool for token creators to have enhanced control of their token.
// This feature allows for controlled token distribution, enabling mechanisms like mandatory KYC verification for token holders.

const fs = require("fs");
const {
  Keypair,
  Connection,
  clusterApiUrl
} = require("@solana/web3.js");

// Read the secret key from the id.json file in the project root
const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Set up the Solana network connection
const network = "devnet"; // You can change this to "mainnet-beta" or "testnet" if needed
const connection = new Connection(clusterApiUrl(network), "confirmed");

// Print the wallet's public key and the network at the start
console.log("Wallet Public Key:", payer.publicKey.toBase58());
console.log("Network:", network);

(async () => {
  // Get and print payer balance
  const balance = await connection.getBalance(payer.publicKey);
    console.log("Payer Balance:", balance / 1e9, "SOL"); // Divide by 1e9 to convert lamports to SOL

})();
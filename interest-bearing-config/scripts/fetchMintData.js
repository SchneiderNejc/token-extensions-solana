// fetchMintData.js
const fs = require("fs");
const os = require("os");
const { Connection, clusterApiUrl } = require("@solana/web3.js");
const { getMint, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

// Define the path to id.json and Load wallet
const secretKeyPath = `${os.homedir()}/.config/solana/id.json`;
const secretKey = JSON.parse(fs.readFileSync(secretKeyPath, "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function fetchMintData(mint) {
  try {
    const mintAccount = await getMint(
      connection,
      mint, // Mint Account Address
      undefined, // Optional commitment
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    console.log("Mint Account Data:", mintAccount);
    return mintAccount;
  } catch (error) {
    console.error("Error fetching mint data:", error);
  }
}

const mint = "YOUR_MINT_PUBLIC_KEY"; // Replace with your mint public key

fetchMintData(mint);

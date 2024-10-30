// getInterestConfig.js
const fs = require("fs");
const os = require("os");
const { Connection, clusterApiUrl } = require("@solana/web3.js");
const { getInterestBearingMintConfigState, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

// Define the path to id.json and Load wallet
const secretKeyPath = `${os.homedir()}/.config/solana/id.json`;
const secretKey = JSON.parse(fs.readFileSync(secretKeyPath, "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function getInterestConfig(mint) {
  try {
    const mintAccount = await getMint(
      connection,
      mint, // Mint Account Address
      undefined, // Optional commitment
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    const interestConfig = await getInterestBearingMintConfigState(mintAccount);
    console.log("Interest Config for Mint:", JSON.stringify(interestConfig, null, 2));
    return interestConfig;
  } catch (error) {
    console.error("Error fetching interest config:", error);
  }
}

const mint = "YOUR_MINT_PUBLIC_KEY"; // Replace with your mint public key

getInterestConfig(mint);

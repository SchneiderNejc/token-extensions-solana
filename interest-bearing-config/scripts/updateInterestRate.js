const fs = require("fs");
const os = require("os");
const { Keypair, Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { updateRateInterestBearingMint, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

// Define the path to id.json and Load wallet
const secretKeyPath = `${os.homedir()}/.config/solana/id.json`;
const secretKey = JSON.parse(fs.readFileSync(secretKeyPath, "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function updateInterestRate(mint, rateAuthority, updateRate) {
  try {
    console.log("Updating interest rate...");
    const transactionSignature = await updateRateInterestBearingMint(
      connection,
      payer, // Transaction fee payer
      mint, // Mint Account Address
      rateAuthority, // Designated Rate Authority
      updateRate, // New interest rate in basis points
      undefined, // Additional signers (if any)
      undefined, // Confirmation options
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    console.log("Interest rate updated:", transactionSignature);
  } catch (error) {
    console.error("Error updating interest rate:", error);
  }
}

const mint = new PublicKey("6Fxvb1ZVcp5V4VdAgTr4ksCFfvbKC46iJqZEV9qvZjjq"); // Replace with your mint public key
const rateAuthority = payer; // Rate Authority, typically the same as payer
const updateRate = 10; // New interest rate in basis points.

updateInterestRate(mint, rateAuthority, updateRate);

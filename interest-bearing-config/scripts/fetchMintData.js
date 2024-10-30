// fetchMintData.js
const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { getMint, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");


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

const mint = new PublicKey("6Fxvb1ZVcp5V4VdAgTr4ksCFfvbKC46iJqZEV9qvZjjq"); // Replace with your mint public key

fetchMintData(mint);

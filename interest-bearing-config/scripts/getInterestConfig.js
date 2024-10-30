// getInterestConfig.js
const fs = require("fs");
const os = require("os");
const { Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { getInterestBearingMintConfigState, getMint, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

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

const mint = new PublicKey("H5tjqzE9FVMxdUKZbzBvFeX7s1AExPzarLLJfDtKFq2j"); // Replace with your mint public key

getInterestConfig(mint);

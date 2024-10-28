const fs = require("fs");
const { Keypair, Connection, clusterApiUrl } = require("@solana/web3.js");
const { setAuthority, AuthorityType, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

// Load wallet
const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Define token account public key (substitute this with your associated token account public key)
const tokenAccountPublicKey = "<YOUR_ASSOCIATED_TOKEN_ACCOUNT_PUBLIC_KEY>";

async function changeTokenAccountOwner() {
  try {
    console.log("Attempting to change owner of token account...");

    await setAuthority(
      connection,
      payer, // Payer of the transaction fee
      tokenAccountPublicKey, // Associated Token Account
      payer.publicKey, // Current owner of the Token Account
      AuthorityType.AccountOwner, // Type of Authority
      new Keypair().publicKey, // New Account Owner
      undefined, // Additional signers
      undefined, // Confirmation options
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    console.log("Owner changed successfully.");
  } catch (error) {
    console.error("Expected error when attempting to change owner:", error);
  }
}

changeTokenAccountOwner().then(() => console.log("changeTokenAccountOwner completed"));

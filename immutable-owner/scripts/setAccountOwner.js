const fs = require("fs");
const os = require("os");

const { Keypair, Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { setAuthority, AuthorityType, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

// Define the path to id.json and Load wallet
const secretKeyPath = `${os.homedir()}/.config/solana/id.json`;
const secretKey = JSON.parse(fs.readFileSync(secretKeyPath, "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Define token account public key (substitute this with your associated token account public key)
const tokenAccountPublicKey = new PublicKey("EozGikr54PQ9dragdPfzFrU3YxXrxXFa3c8nQxWZ7uY3");

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

changeTokenAccountOwner();

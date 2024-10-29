const fs = require("fs");
const { Keypair, Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { createAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

// Load wallet
const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Define mint public key (substitute this with your mint public key)
const mintPublicKey = new PublicKey("HZFN2Ba4r4pmNEvpWjVcg2BofmJ7osqzEcu1wvRH4vKx");

async function createAssociatedTokenAccountForMint() {
  try {
    console.log("Starting createAssociatedTokenAccountForMint...");

    const associatedTokenAccount = await createAssociatedTokenAccount(
      connection,
      payer, // Payer to create Token Account
      mintPublicKey, // Mint Account address
      payer.publicKey, // Token Account owner
      undefined, // Confirmation options
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    console.log("Associated Token Account created:", associatedTokenAccount.toBase58());
    return associatedTokenAccount;
  } catch (error) {
    console.error("Error creating associated token account:", error);
  }
}

createAssociatedTokenAccountForMint();

const fs = require("fs");
const { Keypair, Connection, clusterApiUrl, SystemProgram, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const { TOKEN_2022_PROGRAM_ID, createMint } = require("@solana/spl-token");

// Load wallet
const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function createMintAccount() {
  try {
    // Authority that can mint new tokens
    const mintAuthority = payer.publicKey;
    const decimals = 2;

    console.log("Creating mint account...");
    const mint = await createMint(
      connection,
      payer, // Payer of the transaction and initialization fees
      mintAuthority, // Mint Authority
      null, // Optional Freeze Authority
      decimals, // Decimals of Mint
      undefined, // Optional keypair
      undefined, // Options for confirming the transaction
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    console.log("Mint account created:", mint.toBase58());
    return mint;
  } catch (error) {
    console.error("Error creating mint account:", error);
  }
}

createMintAccount().then(() => console.log("createMintAccount completed"));

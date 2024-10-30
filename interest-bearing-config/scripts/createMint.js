const fs = require("fs");
const os = require("os");
const { Keypair, Connection, clusterApiUrl, SystemProgram, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  ExtensionType,
  createInitializeMintInstruction,
  createInitializeInterestBearingMintInstruction,
} = require("@solana/spl-token");

// Define the path to id.json and Load wallet
const secretKeyPath = `${os.homedir()}/.config/solana/id.json`;
const secretKey = JSON.parse(fs.readFileSync(secretKeyPath, "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function createInterestBearingMintAccount() {
  try {
    const mintAuthority = payer.publicKey;
    const rateAuthority = payer;
    const decimals = 2;
    const rate = 100; // Example rate basis points (1%)

    // Calculate required space for the mint account
    const mintLen = getMintLen([ExtensionType.InterestBearingConfig]);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    // Generate new keypair for the mint account
    const mintKeypair = Keypair.generate();

    // Create the mint account with the necessary space and funding
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    });

    // Initialize the interest-bearing extension
    const initializeInterestBearingMintInstruction = createInitializeInterestBearingMintInstruction(
      mintKeypair.publicKey,
      rateAuthority.publicKey,
      rate,
      TOKEN_2022_PROGRAM_ID
    );

    // Initialize the mint
    const initializeMintInstruction = createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      mintAuthority,
      null,
      TOKEN_2022_PROGRAM_ID
    );

    // Create transaction with ordered instructions
    const transaction = new Transaction().add(
      createAccountInstruction,
      initializeInterestBearingMintInstruction,
      initializeMintInstruction
    );

    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, mintKeypair]
    );

    console.log("Mint account created:", mintKeypair.publicKey.toBase58());
    console.log("Transaction signature:", transactionSignature);
    return mintKeypair.publicKey;

  } catch (error) {
    console.error("Error creating interest-bearing mint account:", error);
  }
}

createInterestBearingMintAccount();

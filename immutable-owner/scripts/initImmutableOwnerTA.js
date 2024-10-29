const fs = require("fs");
const { Keypair, Connection, clusterApiUrl, SystemProgram, Transaction, sendAndConfirmTransaction, PublicKey } = require("@solana/web3.js");
const { ExtensionType, getAccountLen, createInitializeImmutableOwnerInstruction, createInitializeAccountInstruction, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

// Load wallet
const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Define mint public key (substitute this with your mint public key)
const mintPublicKey = new PublicKey("6BzArtz7u9ytVZGdKFsdj63hPP7XHL9L3DTH4CNiKtFQ");

async function initializeImmutableOwnerTokenAccount() {
  try {
    console.log("Initializing immutable owner token account...");

    // Generate a new keypair for the token account
    const tokenAccountKeypair = Keypair.generate();
    const tokenAccount = tokenAccountKeypair.publicKey;

    // Calculate the size and lamports required
    const accountLen = getAccountLen([ExtensionType.ImmutableOwner]);
    const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);

    // Create account instruction
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: tokenAccount,
      space: accountLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    });

    // Initialize the ImmutableOwner extension
    const initializeImmutableOwnerInstruction = createInitializeImmutableOwnerInstruction(
      tokenAccount,
      TOKEN_2022_PROGRAM_ID
    );

    // Initialize the token account data
    const initializeAccountInstruction = createInitializeAccountInstruction(
      tokenAccount,
      mintPublicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID
    );

    // Create and send the transaction
    const transaction = new Transaction().add(
      createAccountInstruction,
      initializeImmutableOwnerInstruction,
      initializeAccountInstruction
    );

    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, tokenAccountKeypair]
    );

    console.log("Token account created with ImmutableOwner extension:", tokenAccount.toBase58());
    console.log("Transaction signature:", transactionSignature);
  } catch (error) {
    console.error("Error initializing token account with ImmutableOwner:", error);
  }
}

initializeImmutableOwnerTokenAccount();

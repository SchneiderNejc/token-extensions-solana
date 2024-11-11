const {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} = require("@solana/web3.js");
const {
  createInitializeMintInstruction,
  createInitializeNonTransferableMintInstruction,
  createAccount,
  mintTo,
  transferChecked,
  burnChecked,
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
} = require("@solana/spl-token");
const os = require("os");
const fs = require("fs");

// Connection and Keypair setup
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Parameters for token setup
const mintDecimals = 9;
const initialMintAmount = 200;
const transferAmount = 100;
const burnAmount = 100;

// Global variables for mint and token addresses
let mint;
let token;

// Utility function to save addresses to file
function saveAddressToFile(filename, address) {
  fs.writeFileSync(filename, address, "utf8");
  console.log(`Saved ${address} to ${filename}`);
}

// Call the desired functions by uncommenting them
(async () => {
  await createMint();
  await createTA();
  await mintTokens();
  await transferTokens();
  await burnTokens();

  async function createMint() {
    const mintKeypair = Keypair.generate();
    mint = mintKeypair.publicKey;
    const mintAuthority = payer;
    const freezeAuthority = payer;
    const extensions = [ExtensionType.NonTransferable];
    const mintLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeNonTransferableMintInstruction(
        mint,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mint,
        mintDecimals,
        mintAuthority.publicKey,
        freezeAuthority.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, mintKeypair],
      undefined
    );

    console.log(`\nMint Account Address: ${mint}`);
    console.log(
      `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );

    // Save mint address to file
    saveAddressToFile("mint_address.txt", mint.toBase58());
  }

  async function createTA() {
    token = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    console.log("Created Token Account:", token.toBase58());

    // Save token account address to file
    saveAddressToFile("token_address.txt", token.toBase58());
  }

  async function mintTokens() {
    const transactionSignature = await mintTo(
      connection,
      payer, // Transaction fee payer
      mint, // Mint account
      token, // Existing token account from previous step
      payer, // Mint authority
      initialMintAmount,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(
      "\nMint Tokens:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  }

  async function transferTokens() {
    // Destination token account (e.g., can be created here or fetched from another source)
    const destinationTokenAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    const transactionSignature = await transferChecked(
      connection,
      payer,
      token, // Source token account from previous step
      mint,
      destinationTokenAccount,
      payer,
      transferAmount,
      mintDecimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(
      "\nTransfer Tokens:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  }

  async function burnTokens() {
    const transactionSignature = await burnChecked(
      connection,
      payer,
      token, // Source token account from previous step
      mint,
      payer,
      burnAmount,
      mintDecimals,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(
      "\nBurn Tokens:",
      `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  }
})();

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
  createInitializePermanentDelegateInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  mintTo,
  transferChecked,
  burnChecked,
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
} = require("@solana/spl-token");
const os = require("os");
const fs = require("fs");

// Utility function to save addresses to file
function saveAddressToFile(filename, address) {
  fs.writeFileSync(filename, address, "utf8");
  console.log(`Saved ${address} to ${filename}`);
}

// Connection and Keypair setup
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Global variables for mint and token addresses
let mint = new PublicKey("AA9udmyZnvGMR5CNkB28UAfAqYQwzcEPKTTqhugYjDSH");
let token = new PublicKey("J1P8xtWTV2a9mvVJqbnop42R6Tno5RbYKYdgwTVwhWzG");

// Parameters for token setup
const mintDecimals = 9;
const initialMintAmount = 200;
const transferAmount = 100;
const burnAmount = 100;

// @note Uncomment the methods to execute them.
(async () => {
  // await createMint();
  // await createTA();
  // await mintTokens();
  // await transferTokens();
  // await burnTokens();

  async function createMint() {
    const mintKeypair = Keypair.generate();
    mint = mintKeypair.publicKey;
    const mintAuthority = payer;
    const permanentDelegate = payer;

    const extensions = [ExtensionType.PermanentDelegate];
    const mintLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint,
        space: mintLen,
        lamports: lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializePermanentDelegateInstruction(
        mint,
        permanentDelegate.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mint,
        9,
        mintAuthority.publicKey,
        null,
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
    // Get the associated token address
    token = await getAssociatedTokenAddress(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    // Check if the associated token account already exists
    const accountInfo = await connection.getAccountInfo(token);
    if (accountInfo === null) {
      // Account does not exist; create it
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          payer.publicKey, // Payer
          token, // New associated token account address
          payer.publicKey, // Owner of the new token account
          mint, // Mint
          TOKEN_2022_PROGRAM_ID // Use TOKEN_2022_PROGRAM_ID if intended
        )
      );
      await sendAndConfirmTransaction(connection, transaction, [payer]);
      console.log("Created Token Account:", token.toBase58());
    } else {
      console.log("Token Account already exists:", token.toBase58());
    }

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

    console.log(`\nMinted ${initialMintAmount} Tokens.`);
    console.log(
      `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  }

  async function transferTokens() {
    // Get the associated token account for the recipient
    const destinationTokenAccount = await getAssociatedTokenAddress(
      mint,
      payer.publicKey, // Update if different recipient is intended
      false,
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

    console.log(`\nTransfered ${initialMintAmount} Tokens.`);
    console.log(
      `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
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

    console.log(`\nBurned ${burnAmount} Tokens.`);
    console.log(
      `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  }
})();

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

(async () => {
  // Call the desired functions by uncommenting them
  await createMint();
  // await createTA();
  // await mint();
  // await transfer();
  // await burn();

  async function createMint() {
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
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
  }

  async function createTA() {
    const destinationTokenAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    console.log("Created Token Account:", destinationTokenAccount.toBase58());
  }

  async function mint() {
    const sourceTokenAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    const transactionSignature = await mintTo(
      connection,
      payer,
      mint,
      sourceTokenAccount,
      mintAuthority,
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

  async function transfer() {
    const sourceTokenAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

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
      sourceTokenAccount,
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

  async function burn() {
    const sourceTokenAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    const transactionSignature = await burnChecked(
      connection,
      payer,
      sourceTokenAccount,
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

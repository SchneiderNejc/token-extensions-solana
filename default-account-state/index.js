const fs = require('fs');
const { Keypair, Connection, clusterApiUrl, SystemProgram, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  AccountState,
  createInitializeDefaultAccountStateInstruction,
  createInitializeMintInstruction,
  getMintLen,
  createAccount,
  mintTo,
  updateDefaultAccountState,
  thawAccount
} = require("@solana/spl-token");

// Read the secret key from the id.json file in the project root
const secretKey = JSON.parse(fs.readFileSync('./id.json', 'utf8'));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

(async () => {
  // Connection to devnet cluster
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Transaction signature
  let transactionSignature;

  // Generate new keypair for Mint Account
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const decimals = 2;
  const mintAuthority = payer.publicKey;
  const freezeAuthority = payer.publicKey;

  const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const defaultState = AccountState.Frozen;
  const initializeDefaultAccountStateInstruction = createInitializeDefaultAccountStateInstruction(
    mint,
    defaultState,
    TOKEN_2022_PROGRAM_ID
  );

  const initializeMintInstruction = createInitializeMintInstruction(
    mint,
    decimals,
    mintAuthority,
    freezeAuthority,
    TOKEN_2022_PROGRAM_ID
  );

  const transaction = new Transaction().add(
    createAccountInstruction,
    initializeDefaultAccountStateInstruction,
    initializeMintInstruction
  );

  transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mintKeypair]
  );

  console.log(
    "\nCreate Mint Account:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );

  const tokenAccount = await createAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  try {
    await mintTo(
      connection,
      payer,
      mint,
      tokenAccount,
      mintAuthority,
      100,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
  } catch (error) {
    console.log("\nExpect Error:", error);
  }

  transactionSignature = await thawAccount(
    connection,
    payer,
    tokenAccount,
    mint,
    freezeAuthority,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(
    "\nThaw Token Account:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );

  transactionSignature = await updateDefaultAccountState(
    connection,
    payer,
    mint,
    AccountState.Initialized,
    freezeAuthority,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(
    "\nUpdate Default Mint Account State:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
})();

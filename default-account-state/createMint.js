const fs = require("fs");
const { Keypair, Connection, clusterApiUrl, SystemProgram, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const { ExtensionType, TOKEN_2022_PROGRAM_ID, AccountState, createInitializeDefaultAccountStateInstruction, createInitializeMintInstruction, getMintLen } = require("@solana/spl-token");

// Network setup
const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const network = "devnet";
const connection = new Connection(clusterApiUrl(network), "confirmed");

(async () => {
  // Token setup
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const decimals = 2;
  const mintAuthority = payer.publicKey;
  const freezeAuthority = payer.publicKey;
  const defaultState = AccountState.Frozen; // @dev Possible states are Uninitialized, Frozen, Initialized, Closed.

  // Get account size & rent
  const mintLen = getMintLen([ExtensionType.DefaultAccountState]);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  // Create mint account.
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  // Set the mint initial state.
  const initializeDefaultAccountStateInstruction =
    createInitializeDefaultAccountStateInstruction(
      mint,
      defaultState,
      TOKEN_2022_PROGRAM_ID
    );

  // Init mint account
  const initializeMintInstruction = createInitializeMintInstruction(
    mint,
    decimals,
    mintAuthority,
    freezeAuthority,
    TOKEN_2022_PROGRAM_ID
  );

  // Create a transaction.
  const transaction = new Transaction().add(
    createAccountInstruction,
    initializeDefaultAccountStateInstruction,
    initializeMintInstruction
  );

  // Submit transaction.
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mintKeypair]
  );

  console.log("\nMint Account Created:", mint.toBase58());
  console.log(`https://solana.fm/tx/${transactionSignature}?cluster=${network}-solana`);
})();

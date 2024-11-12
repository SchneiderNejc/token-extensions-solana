const {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} = require("@solana/web3.js");
const {
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen,
  createInitializeTransferFeeConfigInstruction,
  TOKEN_2022_PROGRAM_ID,
} = require("@solana/spl-token");
const os = require("os");
const fs = require("fs");

// Setup connection & connect wallet.
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);

// Mint params.
const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const mintAuthority = payer;
const decimals = 9;

// Fee params.
const transferFeeConfigAuthority = payer;
const withdrawWithheldAuthority = payer;
const feeBasisPoints = 50; // 5%
const maxFee = BigInt(5_000);

(async () => {
  // Calculate account size.
  const extensions = [ExtensionType.TransferFeeConfig];
  const mintLen = getMintLen(extensions);
  const mintLamports = await connection.getMinimumBalanceForRentExemption(
    mintLen
  );

  // Build tx using create mint, init transfer fee, init mint.
  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeTransferFeeConfigInstruction(
      mint,
      transferFeeConfigAuthority.publicKey,
      withdrawWithheldAuthority.publicKey,
      feeBasisPoints,
      maxFee,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint,
      decimals,
      mintAuthority.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    )
  );
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
    undefined
  );

  console.log("\nMint Account:", mint.toBase58());
  console.log(
    `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
})();

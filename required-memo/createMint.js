const {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} = require("@solana/web3.js");
const {
  createMint,
  createEnableRequiredMemoTransfersInstruction,
  createInitializeAccountInstruction,
  getAccountLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
} = require("@solana/spl-token");
const os = require("os");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const mintAuthority = payer;
const decimals = 9;

(async () => {
  // Create mint.
  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    mintAuthority.publicKey,
    decimals,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
  const lamports = await connection.getMinimumBalanceForRentExemption(
    accountLen
  );

  // Build tx using create TA, initTA, enable memo on TA.
  const owner = payer;
  const tokenKeypair = Keypair.generate();
  const token = tokenKeypair.publicKey;
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: token,
      space: accountLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeAccountInstruction(
      token,
      mint,
      owner.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createEnableRequiredMemoTransfersInstruction(
      token,
      owner.publicKey,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, owner, tokenKeypair],
    undefined
  );

  console.log("\nMint Account:", mint.toBase58());
  console.log("Token Account:", token.toBase58());
  console.log(
    `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
})();

const {
  createReallocateInstruction,
  createEnableRequiredMemoTransfersInstruction,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createMint,
  createAccount,
} = require("@solana/spl-token");
const {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  Transaction,
} = require("@solana/web3.js");
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

  // Create TA.
  const owner = Keypair.generate();
  const account = await createAccount(
    connection,
    payer,
    mint,
    owner.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  // Reallocate, enable memo transfer and cpi guardextension.
  const extensions = [ExtensionType.MemoTransfer, ExtensionType.CpiGuard];
  const transaction = new Transaction().add(
    createReallocateInstruction(
      account,
      payer.publicKey,
      extensions,
      owner.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID
    ),
    createEnableRequiredMemoTransfersInstruction(
      account, // Token Account address
      owner.publicKey, // Token Account Owner
      [], // Additional signers
      TOKEN_2022_PROGRAM_ID
    )
  );
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, owner],
    undefined
  );

  console.log(
    `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
})();

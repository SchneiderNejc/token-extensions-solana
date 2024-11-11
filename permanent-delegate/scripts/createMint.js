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
  createInitializePermanentDelegateInstruction,
  getMintLen,
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

(async () => {
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const mintAuthority = payer;
  const permanentDelegate = payer;

  const extensions = [ExtensionType.PermanentDelegate];
  const mintLen = getMintLen(extensions);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

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
  return mint;
})();

const {
  createInitializeMintInstruction,
  createInitializeMintCloseAuthorityInstruction,
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
} = require("@solana/spl-token");
const {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} = require("@solana/web3.js");
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
  const freezeAuthority = payer;
  const closeAuthority = payer;

  const extensions = [ExtensionType.MintCloseAuthority];
  const mintLen = getMintLen(extensions);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMintCloseAuthorityInstruction(
      mint,
      closeAuthority.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint,
      9,
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
    console.log(`Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
    return mint;
})();

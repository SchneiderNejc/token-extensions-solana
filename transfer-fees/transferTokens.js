const {
  clusterApiUrl,
  transferCheckedWithFee,
  Connection,
  Keypair,
  PublicKey,
} = require("@solana/web3.js");
const {
  createAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
} = require("@solana/spl-token");
const os = require("os");
const fs = require("fs");

// Setup connection & connect wallet.
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);

// Mint params.
const mint = new PublicKey("8u8C4VB2WPKrjrUZa4KGGSin1j9gJQhJ7UmVuh8TuNWG");
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

(async () => {
  // Create sender's TA, mint tokens.
  const mintAmount = BigInt(1_000_000_000);
  const owner = payer;
  const mintAuthority = owner;
  const senderTA = await getAssociatedTokenAddress(
    mint, // Mint address
    owner.publicKey // Owner's public key
  );

  const existingSenderTA = await connection.getAccountInfo(senderTA);
  if (!existingSenderTA) {
    console.log("doesnt exist.");
    senderTA = await createAccount(
      connection,
      payer,
      mint,
      owner.publicKey,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    await mintTo(
      connection,
      payer,
      mint,
      senderTA,
      mintAuthority,
      mintAmount,
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
  }

  // Create receiver's TA, mint tokens.
  const receiverTA = await getAssociatedTokenAddress(
    mint, // Mint address
    owner.publicKey // Receiver's public key
  );
  const existingReceiverTA = await connection.getAccountInfo(receiverTA);
  if (!existingReceiverTA) {
    const receiverKeypair = Keypair.generate();
    const receiverTA = await createAccount(
      connection,
      payer,
      mint,
      receiverKeypair.publicKey,
      receiverKeypair,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
  }

  // Transfer tokens from
  const transferAmount = BigInt(1_000_000);
  const fee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);
  const transactionSignature = await transferCheckedWithFee(
    connection,
    payer,
    senderTA,
    mint,
    receiverTA,
    owner,
    transferAmount,
    decimals,
    fee,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(
    `${transferAmount} tokens were sent from ${senderTA.toBase58()} to ${receiverTA.toBase58()}`
  );
  console.log(
    `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
})();

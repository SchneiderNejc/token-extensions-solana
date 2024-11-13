const {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} = require("@solana/web3.js");
const {
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
const mint = new PublicKey("FRyKjBBLnru1WAThr5bM7UfZygkP25y4u9iVtAwHqZX8");
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const mintAmount = BigInt(1_000_000_000);
const mintAuthority = payer;

(async () => {
  // Get sender's TA.
  const senderTA = await getAssociatedTokenAddress(
    mint, // Mint address
    payer.publicKey // Owner's public key
  );

  const existingSenderTA = await connection.getAccountInfo(senderTA);
  if (!existingSenderTA) {
    console.log("Sender's TA doesn't exist. Exiting.");
    return;
  }

  // Mint tokens to sender's TA.
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

  console.log(`Minted ${mintAmount} tokens to ${senderTA.toBase58()}.`);
})();

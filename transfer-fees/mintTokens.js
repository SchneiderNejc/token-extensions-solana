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
const path = require("path");

// Setup connection & connect wallet.
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const mintAmount = BigInt(1_000_000_000);
const mintAuthority = payer;

// Define the path for accounts.json
const dataPath = path.join(__dirname, "accounts.json");

// Load mint address from accounts.json or log error if it doesn't exist
let mint;
if (fs.existsSync(dataPath)) {
  const accountData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  if (accountData.mintAddress) {
    mint = new PublicKey(accountData.mintAddress);
  } else {
    console.error("Mint account not found. Run createMint.js first.");
    process.exit(1);
  }
} else {
  console.error("accounts.json file not found. Run createMint.js first.");
  process.exit(1);
}

// Main function.
(async () => {
  // Get sender's TA.
  const senderTA = await getAssociatedTokenAddress(
    mint, // Mint address
    payer.publicKey, // Owner's public key
    false,
    TOKEN_2022_PROGRAM_ID
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

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
const mintAmount = 1_000_000; // Tokens you want to mint (without considering decimals)
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
  // Replace the getAccountInfo call with getMintInfo
  const mintInfo = await connection.getAccountInfo(mint);
  if (!mintInfo) {
    console.error("Mint account not found. Exiting.");
    process.exit(1);
  }

  // Fetch mint data directly using the SPL Token library
  const mintData = await connection.getParsedAccountInfo(mint);
  let decimals;
  if (mintData.value) {
    decimals = mintData.value.data.parsed.info.decimals;
    console.log(`Token decimals: ${decimals}`);
  } else {
    console.error("Failed to fetch mint data.");
    process.exit(1);
  }

  // Adjust the mintAmount to account for decimals
  const adjustedMintAmount = BigInt(mintAmount) * BigInt(10 ** decimals);

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
    adjustedMintAmount,
    [], // No signers needed
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(
    `Minted ${mintAmount} tokens (adjusted for decimals) to ${senderTA.toBase58()}.`
  );
})();

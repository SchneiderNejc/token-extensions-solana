const {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} = require("@solana/web3.js");
const {
  getAssociatedTokenAddress,
  transferCheckedWithFee,
  TOKEN_2022_PROGRAM_ID,
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

// Load mint address and receiver public key from accounts.json
const dataPath = path.join(__dirname, "accounts.json");
let mint, receiverPublicKey;

try {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  if (!data.mintAddress || !data.receiver?.walletAddress) {
    throw new Error(
      "Mint address or receiver public key is missing in accounts.json."
    );
  }
  mint = new PublicKey(data.mintAddress);
  receiverPublicKey = new PublicKey(data.receiver.walletAddress);
} catch (error) {
  console.error("Error loading data from accounts.json:", error.message);
  process.exit(1);
}

// Transfer parameters
const feeBasisPoints = 50; // 5%
const transferAmount = BigInt(1_000_000);
const decimals = 9;

(async () => {
  try {
    // Get sender's and receiver's associated token accounts (TAs)
    const senderTA = await getAssociatedTokenAddress(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    const receiverTA = await getAssociatedTokenAddress(
      mint,
      receiverPublicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    // Transfer tokens from sender to receiver
    const fee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10_000);
    const transactionSignature = await transferCheckedWithFee(
      connection,
      payer,
      senderTA,
      mint,
      receiverTA,
      payer,
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
  } catch (error) {
    console.error("Transfer failed:", error.message);
  }
})();

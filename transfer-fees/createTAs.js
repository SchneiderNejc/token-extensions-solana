const {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const {
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} = require("@solana/spl-token");
const os = require("os");
const fs = require("fs");
const path = require("path");

// Setup connection & connect wallet.
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const dataPath = path.join(__dirname, "accounts.json");
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

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
  // Get or create sender's TA
  const senderTA = await getOrCreateATA(payer);

  // Get or create receiver's wallet and TA
  const receiverKeypair = getOrCreateReceiverWallet();
  const receiverTA = await getOrCreateATA(receiverKeypair);

  // Save sender's ATA, receiver's ATA, and receiver's wallet secret to JSON
  const data = {
    mintAddress: mint.toBase58(), // Ensure the mint address is saved back to the file
    sender: {
      taAddress: senderTA.toBase58(),
    },
    receiver: {
      taAddress: receiverTA.toBase58(),
      walletAddress: receiverKeypair.publicKey.toBase58(),
      walletSecret: Array.from(receiverKeypair.secretKey),
    },
  };

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log("Token accounts created or retrieved, and data saved to JSON.");
})();

// Helper function to get or create an associated token account
async function getOrCreateATA(owner) {
  let associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    owner.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  let accountInfo = await connection.getAccountInfo(associatedTokenAddress);
  if (accountInfo) {
    console.log(
      "Associated Token Account exists at:",
      associatedTokenAddress.toBase58()
    );
  } else {
    console.log("Associated Token Account does not exist. Creating...");
    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        payer.publicKey,
        associatedTokenAddress,
        owner.publicKey,
        mint,
        TOKEN_2022_PROGRAM_ID
      )
    );
    await sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log(
      "Associated Token Account created at:",
      associatedTokenAddress.toBase58()
    );
  }
  return associatedTokenAddress;
}

// Function to get existing receiver wallet from JSON or create a new Keypair
function getOrCreateReceiverWallet() {
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const receiverWallet = data.receiver?.walletSecret;
    if (receiverWallet) {
      console.log(
        "Found existing receiver wallet:",
        data.receiver.walletAddress
      );
      return Keypair.fromSecretKey(new Uint8Array(receiverWallet));
    }
  }
  const receiverKeypair = Keypair.generate();
  console.log(
    "New receiver wallet generated:",
    receiverKeypair.publicKey.toBase58()
  );
  return receiverKeypair;
}

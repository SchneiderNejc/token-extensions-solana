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

// Setup connection & connect wallet.
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);

// Mint params.
const mint = new PublicKey("FRyKjBBLnru1WAThr5bM7UfZygkP25y4u9iVtAwHqZX8");
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

(async () => {
  // Get or create sender's TA.
  let owner = payer;

  // ----------------- @todo move the code section into seperate helper function since it repeats twice. -----------
  // ----------------------- Call the function getOrCreateATA(owner)------------------------------------------------------------
  let associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    owner.publicKey,
    false, // do not allow the program to create an account
    TOKEN_2022_PROGRAM_ID // Use TOKEN_2022_PROGRAM_ID for mints with extensions
  );

  // Attempt to retrieve the account info
  let accountInfo = await connection.getAccountInfo(associatedTokenAddress);

  // Print TA address for existing account or create a new one.
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
  // ----------------- End of the section. --------------------------------------------------

  // Get or create Receiver's TA.
  receiverKeypair = Keypair.generate(); // @todo look into file system (csv) if receiverKeypair exists. If yes, use it. If not, generate it.
  owner = receiverKeypair;
  associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    owner.publicKey,
    false, // do not allow the program to create an account
    TOKEN_2022_PROGRAM_ID // Use TOKEN_2022_PROGRAM_ID for mints with extensions
  );

  // Attempt to retrieve the account info
  accountInfo = await connection.getAccountInfo(associatedTokenAddress);
  // Print TA address for existing account or create a new one.
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

  // // Save addresses to CSV.
  const addresses = [
    { type: "Sender", address: senderTA.address.toBase58() },
    // @todo also save receiver wallet address, if created for the first time.
    { type: "Receiver", address: receiverTA.address.toBase58() },
  ];

  const csvData = addresses
    .map((row) => `${row.type},${row.address}`)
    .join("\n");

  fs.writeFileSync("token_accounts.csv", csvData);

  console.log("Token accounts created or retrieved.");
})();

const fs = require("fs");
const {
  Keypair,
  Connection,
  clusterApiUrl,
  PublicKey,
} = require("@solana/web3.js"); // Add PublicKey import
const { createAccount, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const network = "devnet";
const connection = new Connection(clusterApiUrl(network), "confirmed");

// Enter the mint account public key that was created using the createMint script.
const mintPubKey = new PublicKey(
  "3DDm4ZWcbdc3xPk6Rf9s41ifUJiXzKWBZPXuwbpDrGtC"
);

(async () => {
  // Create a token account associated with specified mint and owner.
  console.log("Creating token account...");
  const tokenAccount = await createAccount(
    connection,
    payer,
    mintPubKey,
    payer.publicKey,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log("\nToken Account Created:", tokenAccount.toBase58());
})();

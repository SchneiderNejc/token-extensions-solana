const { createAccount, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");
const {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} = require("@solana/web3.js");
const os = require("os");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// @note Update mint address.
const mint = new PublicKey("JAVPtYcq2RzGNztFw4jbA69gVLh4Kve1592xMGTCQa1A");

(async () => {
  // Create Token Account for Playground wallet
  const tokenAccount = await createAccount(
    connection,
    payer, // Payer to create Token Account
    mint, // Mint Account address
    payer.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  console.log("\nToken Account Created:", tokenAccount.toBase58());

  console.log(
    "\nMint Tokens:",
    `https://solana.fm/tx/${tokenAccount}?cluster=devnet-solana`
  );
})();

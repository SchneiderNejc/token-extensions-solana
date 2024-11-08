const { mintTo, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");
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
const tokenAccount = new PublicKey(
  "FC7bSaXhuy3sLgk5jtfd4yQi4EXjQYeEZM6W5giVyyY9"
);

(async () => {
  // Mint tokens to tokenAccount
  let transactionSignature = await mintTo(
    connection,
    payer, // Transaction fee payer
    mint, // Mint Account address
    tokenAccount, // Mint to
    payer.publicKey, // Mint Authority address
    120, // Amount
    undefined, // Additional signers
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
  );

  console.log("\nToken Account Created:", tokenAccount.toBase58());

  console.log(
    "\nMint Tokens:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
})();

const fs = require("fs");
const { Keypair, Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { thawAccount, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const network = "devnet";
const connection = new Connection(clusterApiUrl(network), "confirmed");

// Enter the mint account token account public key
const mintPubKey = new PublicKey("3DDm4ZWcbdc3xPk6Rf9s41ifUJiXzKWBZPXuwbpDrGtC");
const tokenPubKey = new PublicKey("5VuLTRMaosASjDKowJbs7SC5e2DobtK53Az1WYAp3LVc");

(async () => {
  console.log("Thawing token account...")
  const transactionSignature = await thawAccount(
    connection,
    payer,
    tokenPubKey,
    mintPubKey,
    payer.publicKey, // Assuming the freeze authority is the payer
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log("\nToken Account Thawed:");
  console.log(`https://solana.fm/tx/${transactionSignature}?cluster=${network}-solana`);
})();

const fs = require("fs");
const { Keypair, Connection, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { updateDefaultAccountState, AccountState, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");

const secretKey = JSON.parse(fs.readFileSync("./id.json", "utf8"));
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const network = "devnet";
const connection = new Connection(clusterApiUrl(network), "confirmed");

// Enter the mint account public key
const mintPubKey = new PublicKey("3DDm4ZWcbdc3xPk6Rf9s41ifUJiXzKWBZPXuwbpDrGtC");

(async () => {
  console.log("Updating Default Mint Account State...");
  const transactionSignature = await updateDefaultAccountState(
    connection,
    payer,
    mintPubKey,
    AccountState.Initialized, // Set state to Initialized
    payer.publicKey, // Assuming the payer is the freeze authority
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  console.log("\nUpdated Default Mint Account State:");
  console.log(`https://solana.fm/tx/${transactionSignature}?cluster=${network}-solana`);
})();

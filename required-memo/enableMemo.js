const {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} = require("@solana/web3.js");
const {
  enableRequiredMemoTransfers,
  disableRequiredMemoTransfers,
  TOKEN_2022_PROGRAM_ID,
} = require("@solana/spl-token");
const os = require("os");
const fs = require("fs");

// Connection and Keypair setup
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Parameters for token setup
const token = new PublicKey("4ctjXoWYnncpAe1NJdwg6GYzCpX7aWpT8zaVEDaeZ1cS");
const owner = payer;

(async () => {
  // @note Uncomment the methods to execute them.
  await enableMemo();
  await disableMemo();

  async function enableMemo() {
    const transactionSignature = await enableRequiredMemoTransfers(
      connection,
      payer,
      token,
      owner,
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    printTx(transactionSignature);
  }

  async function disableMemo() {
    const transactionSignature = await disableRequiredMemoTransfers(
      connection,
      payer,
      token,
      owner,
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    printTx(transactionSignature);
  }

  async function printTx(transactionSignature) {
    console.log(
      `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
  }
})();

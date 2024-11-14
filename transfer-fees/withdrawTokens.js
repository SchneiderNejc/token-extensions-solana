const {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} = require("@solana/web3.js");
const {
  TOKEN_2022_PROGRAM_ID,
  unpackAccount,
  getTransferFeeAmount,
  withdrawWithheldTokensFromAccounts,
} = require("@solana/spl-token");
const os = require("os");
const fs = require("fs");
const path = require("path");

// Setup connection & connect wallet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

// Load mint and destination account (receiverTA) from JSON file
const dataPath = path.join(__dirname, "accounts.json");
let mint, destinationAccount;
try {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  mint = new PublicKey(data.mintAddress);
  destinationAccount = new PublicKey(data.receiver.taAddress);
} catch (error) {
  console.error(
    "Mint or destination account not found. Ensure accounts.json has required data."
  );
  process.exit(1);
}

// Main function to find and withdraw withheld tokens
(async () => {
  console.log("Scanning accounts for withheld tokens...");

  // Find accounts with withheld tokens for the specified mint
  const allAccounts = await connection.getProgramAccounts(
    TOKEN_2022_PROGRAM_ID,
    {
      commitment: "confirmed",
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: mint.toString(),
          },
        },
        {
          dataSize: 165, // Typical size for token accounts
        },
      ],
    }
  );

  const accountsToWithdrawFrom = [];
  for (const accountInfo of allAccounts) {
    console.log("Checking account:", accountInfo.pubkey.toBase58());
    console.log("Account info:", accountInfo);

    const account = unpackAccount(
      accountInfo.account,
      accountInfo.pubkey,
      TOKEN_2022_PROGRAM_ID
    );
    const transferFeeAmount = getTransferFeeAmount(account);

    console.log("Transfer fee amount:", transferFeeAmount); // Add this log

    if (
      transferFeeAmount !== null &&
      transferFeeAmount.withheldAmount > BigInt(0)
    ) {
      accountsToWithdrawFrom.push(accountInfo.pubkey);
    }
  }

  if (accountsToWithdrawFrom.length === 0) {
    console.log("No accounts found with withheld tokens.");
    return;
  }

  console.log(
    `Found ${accountsToWithdrawFrom.length} account(s) with withheld tokens.`
  );
  console.log("Withdrawing withheld tokens to destination account...");

  try {
    await withdrawWithheldTokensFromAccounts(
      connection,
      payer,
      mint,
      destinationAccount,
      payer, // Withdraw withheld authority is payer
      [],
      accountsToWithdrawFrom,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(
      `Withheld tokens successfully withdrawn to ${destinationAccount.toBase58()}`
    );
  } catch (error) {
    console.error("Failed to withdraw withheld tokens:", error);
  }
})();

const { createInitializeInstruction } = require("@solana/spl-token-metadata");
const { sendAndConfirmTransaction, Transaction } = require("@solana/web3.js");
const { connection, payer } = require("./initConnection");

async function initializeMetadata(mint, updateAuthority) {
  const transaction = new Transaction().add(
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      updateAuthority: updateAuthority,
      mint: mint,
      mintAuthority: updateAuthority,
      name: "OPOS",
      symbol: "OPOS",
      uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
    })
  );

  const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log(`\nMetadata Initialized: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
}

module.exports = { initializeMetadata };

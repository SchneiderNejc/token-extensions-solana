// removeMetadataField.js
const { createRemoveKeyInstruction } = require("@solana/spl-token-metadata");
const { connection, payer } = require("./initializeConnection");

async function removeMetadataField(mint, updateAuthority, key) {
  const transaction = new Transaction().add(
    createRemoveKeyInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      updateAuthority: updateAuthority,
      key: key,
      idempotent: true,
    })
  );

  const transactionSignature = await connection.sendTransaction(transaction, [payer]);

  console.log(`\nMetadata Field Removed: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
}

module.exports = { removeMetadataField };

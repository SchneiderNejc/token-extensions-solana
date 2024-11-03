const { createRemoveKeyInstruction, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");
const { sendAndConfirmTransaction, Transaction } = require("@solana/web3.js");
const { connection, payer } = require("./initConnection");

async function removeMetadataField(mint, key) {
  const transaction = new Transaction().add(
    createRemoveKeyInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      updateAuthority: payer.publicKey,
      key: key,
      idempotent: true,
    })
  );

  const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log(`\nMetadata Field Removed: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
}

module.exports = { removeMetadataField };

const { createUpdateFieldInstruction } = require("@solana/spl-token-metadata");
const { sendAndConfirmTransaction, Transaction } = require("@solana/web3.js");
const { connection, payer } = require("./initConnection");

async function updateMetadataField(mint, field, value) {
  const transaction = new Transaction().add(
    createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      updateAuthority: payer.publicKey,
      field: field,
      value: value,
    })
  );

  const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log(`\nMetadata Field Updated: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
}

module.exports = { updateMetadataField };

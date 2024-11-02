// updateMetadataField.js
const { createUpdateFieldInstruction } = require("@solana/spl-token-metadata");
const { connection, payer } = require("./initConnection");

async function updateMetadataField(mint, updateAuthority, field, value) {
  const transaction = new Transaction().add(
    createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      updateAuthority: updateAuthority,
      field: field,
      value: value,
    })
  );

  const transactionSignature = await connection.sendTransaction(transaction, [payer]);

  console.log(`\nMetadata Field Updated: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
}

module.exports = { updateMetadataField };

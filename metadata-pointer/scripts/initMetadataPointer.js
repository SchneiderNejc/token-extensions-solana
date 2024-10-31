// initializeMetadataPointer.js
const { createInitializeMetadataPointerInstruction } = require("@solana/spl-token");
const { connection, payer } = require("./initializeConnection");

async function initializeMetadataPointer(mint, updateAuthority) {
  const transaction = new Transaction().add(
    createInitializeMetadataPointerInstruction(
      mint,
      updateAuthority,
      mint,
      TOKEN_2022_PROGRAM_ID
    )
  );

  const transactionSignature = await connection.sendTransaction(transaction, [payer]);

  console.log(`\nMetadata Pointer Initialized: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
}

module.exports = { initializeMetadataPointer };

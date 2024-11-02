const { createInitializeMetadataPointerInstruction } = require("@solana/spl-token");
const { sendAndConfirmTransaction, Transaction } = require("@solana/web3.js");
const { connection, payer } = require("./initConnection");

async function initializeMetadataPointer(mint, updateAuthority) {
  const transaction = new Transaction().add(
    createInitializeMetadataPointerInstruction(
      mint,
      updateAuthority,
      mint,
      TOKEN_2022_PROGRAM_ID
    )
  );

  const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log(`\nMetadata Pointer Initialized: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
}

module.exports = { initializeMetadataPointer };

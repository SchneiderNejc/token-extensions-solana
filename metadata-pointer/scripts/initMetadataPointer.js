const { createInitializeMetadataPointerInstruction, TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");
const { sendAndConfirmTransaction, Transaction, PublicKey } = require("@solana/web3.js");
const { connection, payer } = require("./initConnection");

async function initializeMetadataPointer(mint, updateAuthority) {
  // Convert mint and updateAuthority to PublicKey if they are not already
  const mint = new PublicKey(mint);
  const updateAuthority = new PublicKey(updateAuthority);

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

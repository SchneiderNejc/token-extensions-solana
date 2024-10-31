// initializeMetadata.js
const { createInitializeInstruction, TokenMetadata } = require("@solana/spl-token-metadata");
const { connection, payer } = require("./initializeConnection");

async function initializeMetadata(mint, mintAuthority, updateAuthority, name, symbol, uri) {
  const metadata = {
    updateAuthority: updateAuthority,
    mint: mint,
    name: name,
    symbol: symbol,
    uri: uri,
  };

  const transaction = new Transaction().add(
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      updateAuthority: updateAuthority,
      mint: mint,
      mintAuthority: mintAuthority,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
    })
  );

  const transactionSignature = await connection.sendTransaction(transaction, [payer]);

  console.log(`\nMetadata Initialized: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
}

module.exports = { initializeMetadata };

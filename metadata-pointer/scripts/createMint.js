const {
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const {
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} = require('@solana/spl-token');
const { connection, payer } = require("./initConnection");
const { createInitializeInstruction, pack } = require('@solana/spl-token-metadata');

async function createMint() {

  // Define mint.
  const mint = Keypair.generate();
  const decimals = 9;

  // Define metadata.
  const metadata = {
    mint: mint.publicKey,
    name: 'TOKEN_NAME',
    symbol: 'SMBL',
    uri: 'URI',
    additionalMetadata: [['new-field', 'new-value']],
  };

  // Calculate account length.
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

  // Create a mint with metadata extension
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: mintLen,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(mint.publicKey, payer.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID),
    createInitializeMintInstruction(mint.publicKey, decimals, payer.publicKey, null, TOKEN_2022_PROGRAM_ID),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mint.publicKey,
      metadata: mint.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: payer.publicKey,
      updateAuthority: payer.publicKey,
    }),
  );

  await sendAndConfirmTransaction(connection, transaction, [payer, mint]);
  console.log(`\nMint Account Address: ${mint.publicKey.toBase58()}`);
  return mint.publicKey.toBase58();
}

module.exports = { createMint };

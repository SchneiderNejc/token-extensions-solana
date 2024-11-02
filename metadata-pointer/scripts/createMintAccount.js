const {
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const { TOKEN_2022_PROGRAM_ID, getMintLen, ExtensionType } = require("@solana/spl-token");
const { connection, payer } = require("./initConnection");

async function createMintAccount() {
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const lamports = await connection.getMinimumBalanceForRentExemption(getMintLen([ExtensionType.MetadataPointer]));

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: getMintLen([ExtensionType.MetadataPointer]),
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    })
  );

  await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair]);

  return { mint, mintKeypair };
}

module.exports = { createMintAccount };

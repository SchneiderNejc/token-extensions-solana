// createMintAccount.js
const { sendAndConfirmTransaction, Keypair, SystemProgram, Transaction, clusterApiUrl, Connection } = require("@solana/web3.js");
const { TOKEN_2022_PROGRAM_ID, ExtensionType, getMintLen } = require("@solana/spl-token");
const { connection, payer } = require("./initializeConnection");


async function createMintAccount(decimals, mintAuthority) {
  // Generate a new mint account keypair
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;

  // Calculate account space requirements
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    console.log(`Creating Mint Account Address...`);

  // Create transaction to set up mint account
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    })
  );

  // Send transaction
  const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair]);

  console.log(`\nMint Account Created: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
  return { mint, mintKeypair };
}

// Define parameters for the new mint account
const decimals = 2; // Mint decimals
const mintAuthority = payer.publicKey; // Mint authority

// Run the function
createMintAccount(decimals, mintAuthority).then(({ mint }) => {
  console.log(`Mint Account Address: ${mint.toBase58()}`);
}).catch((error) => {
  console.error("Error creating mint account:", error);
});

module.exports = { createMintAccount };

const {
    clusterApiUrl,
    sendAndConfirmTransaction,
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
  } = require("@solana/web3.js");
const {
    createInitializeMintInstruction,
    createInitializeNonTransferableMintInstruction,
    getMintLen,
    ExtensionType,
    TOKEN_2022_PROGRAM_ID,
  } = require("@solana/spl-token");
  const os = require("os");
  const fs = require("fs");

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const secretKey = JSON.parse(
    fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
  );
  const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

  (async () => {
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    const mintAuthority = payer;
    const freezeAuthority = payer;

    const extensions = [ExtensionType.NonTransferable];
    const mintLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeNonTransferableMintInstruction(
        mint,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mint,
        9,
        mintAuthority.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
      )
    );
    const transactionSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, mintKeypair],
      undefined
    );
      console.log(`\nMint Account Address: ${mint}`);
      console.log(`Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
      return mint;
  })();

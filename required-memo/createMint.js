import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  createEnableRequiredMemoTransfersInstruction,
  createInitializeAccountInstruction,
  getAccountLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
const os = require("os");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
const mintAuthority = payer;
const decimals = 9;

(async () => {
  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    mintAuthority.publicKey,
    decimals,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
  const lamports = await connection.getMinimumBalanceForRentExemption(
    accountLen
  );

  const owner = Keypair.generate();
  const destinationKeypair = Keypair.generate();
  const destination = destinationKeypair.publicKey;
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: destination,
      space: accountLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeAccountInstruction(
      destination,
      mint,
      owner.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createEnableRequiredMemoTransfersInstruction(
      destination,
      owner.publicKey,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, owner, destinationKeypair],
    undefined
  );

  console.log(
    `Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
})();

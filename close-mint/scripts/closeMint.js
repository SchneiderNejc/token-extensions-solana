const{
    closeAccount,
    TOKEN_2022_PROGRAM_ID,
} = require('@solana/spl-token');
const{
    clusterApiUrl,
    Connection,
    Keypair,
} = require('@solana/web3.js');
const os = require("os");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const secretKey = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.config/solana/id.json`, "utf8")
);
const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

(async () => {

    // @note Update mint address.
    const mint = "DyxoBL8YrmoTvAnLxhDrWideGoADBp65XLAqQRox47Ai";
    const closeAuthority = payer;

    const transactionSignature = await closeAccount(connection, payer, mint, payer.publicKey, closeAuthority, [], undefined, TOKEN_2022_PROGRAM_ID);

    console.log(`\nMint Account Closed: ${mint}`);
    console.log(`Transaction URL: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
})();
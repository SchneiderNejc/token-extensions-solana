const { getTokenMetadata } = require("@solana/spl-token");
const { connection } = require("./initConnection");
const { PublicKey } = require("@solana/web3.js");

async function fetchMetadata(mint) {
  const mintPublicKey = new PublicKey(mint); // Convert mint to PublicKey
  const metadata = await getTokenMetadata(connection, mintPublicKey);
  return metadata;
}

module.exports = { fetchMetadata };

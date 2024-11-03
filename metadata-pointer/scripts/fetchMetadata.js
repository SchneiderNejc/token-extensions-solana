const { getTokenMetadata } = require("@solana/spl-token");
const { connection } = require("./initConnection");

async function fetchMetadata(mint) {
  const metadata = await getTokenMetadata(connection, mint);
  return metadata;
}

module.exports = { fetchMetadata };

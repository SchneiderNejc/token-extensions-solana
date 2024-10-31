// fetchMetadata.js
const { getTokenMetadata } = require("@solana/spl-token-metadata");
const { connection } = require("./initializeConnection");

async function fetchMetadata(mint) {
  const metadata = await getTokenMetadata(connection, mint);
  console.log("\nFetched Metadata:", JSON.stringify(metadata, null, 2));
}

module.exports = { fetchMetadata };

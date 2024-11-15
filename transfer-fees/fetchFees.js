const { clusterApiUrl, Connection, PublicKey } = require("@solana/web3.js");

// Replace with your mint address
const mintAddress = "C46CyATH7bSGdoxUSoatT42dgRare6yHbnBnaYVd6sFM";

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const mintPublicKey = new PublicKey(mintAddress);

  try {
    // Fetch the mint account data
    const mintAccountInfo = await connection.getAccountInfo(mintPublicKey);
    if (!mintAccountInfo) {
      console.error("Mint account not found.");
      process.exit(1);
    }

    const rawData = mintAccountInfo.data;
    console.log("Raw Mint Data (Hex):", rawData.toString("hex"));

    // Validate raw data length
    const expectedLength = 278; // Adjust if needed
    if (rawData.length < expectedLength) {
      throw new Error(
        `Data length mismatch. Expected at least ${expectedLength} bytes, got ${rawData.length}.`
      );
    }

    // Check TransferFeeConfig extension starting at byte 82
    const extensionStartIndex = 82;
    const extensionData = rawData.slice(
      extensionStartIndex,
      extensionStartIndex + 20
    ); // First 20 bytes
    console.log("Extension Raw Bytes (Hex):", extensionData.toString("hex"));

    // Parse TransferFeeConfig fields
    const currentFeeEpoch = rawData.readBigUInt64LE(extensionStartIndex); // 8 bytes
    const feeBasisPoints = rawData.readUInt32LE(extensionStartIndex + 8); // 4 bytes
    const maxFee = rawData.readBigUInt64LE(extensionStartIndex + 12); // 8 bytes

    // Validate parsed values
    console.log("Parsed Transfer Fee Config:");
    console.log(`  Current Fee Epoch: ${currentFeeEpoch}`);
    console.log(`  Fee Basis Points: ${(feeBasisPoints / 100).toFixed(2)}%`);
    console.log(`  Maximum Fee: ${(Number(maxFee) / 10 ** 9).toFixed(9)} SOL`);
  } catch (error) {
    console.error("Error fetching or parsing mint data:", error.message);
  }
})();

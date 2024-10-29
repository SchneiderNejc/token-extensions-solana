// Required imports
const { PublicKey } = require("@solana/web3.js");
const { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require("@solana/spl-token");

// @note Replace the PublicKey instances.
const ownerPubkey = new PublicKey("6ZJDfSVjffvRYbtpFF33PSeYWNYJnbtMKiwWVt1YRjZW");
const mintPubkey = new PublicKey("DqykVCokVUUQnsazEJg3UzbPXUALuc5S4ttj7EocLStD");
const tokenAccountAddress = new PublicKey("Cs2VQKewaYQxafiW3oSd1vndDwWYQYxq1uP4NTZiLnr2");

/**
 * Checks if the given token account is an associated token account (ATA) for the specified owner and mint.
 *
 * @return {Promise<boolean>} - Returns true if the given token account address is an ATA, otherwise false.
**/
async function isATA() {

  try {
    // Derive the expected ATA for the owner and mint
    const derivedATA = await getAssociatedTokenAddress(
      mintPubkey,
      ownerPubkey,
      false, // Typically false, as we usually don't allow off-curve addresses for ATAs
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Check if the derived ATA matches the provided token account address
    return derivedATA.equals(tokenAccountAddress);
  } catch (error) {
    console.error("Error in determining if the account is an ATA:", error);
    return false;
  }
}

// Print the results.
(async () => {
    const result = await isATA();

    if (result) {
      console.log(`${tokenAccountAddress.toBase58()} is an ATA.`);
    } else {
      console.log(`${tokenAccountAddress.toBase58()} isn't an ATA.`);
    }
})();

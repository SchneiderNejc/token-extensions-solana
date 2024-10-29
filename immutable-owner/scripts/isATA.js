// Required imports
const { PublicKey } = require("@solana/web3.js");
const { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require("@solana/spl-token");

/**
 * Checks if the given token account is an associated token account (ATA) for the specified owner and mint.
 *
 * @param {PublicKey} ownerPubkey - The public key of the owner.
 * @param {PublicKey} mintPubkey - The public key of the mint.
 * @param {PublicKey} tokenAccountAddress - The public key of the token account to verify.
 * @returns {Promise<boolean>} - Returns true if the given token account address is an ATA, otherwise false.
 */
async function isATA() {
    // @note Replace the PublicKey instances.
    const ownerPubkey = new PublicKey("6ZJDfSVjffvRYbtpFF33PSeYWNYJnbtMKiwWVt1YRjZW");
    const mintPubkey = new PublicKey("6AVfbK9xmwP8hS7BrxBteGaEt5c67G6Eom9BnepqRDs5");
    const tokenAccountAddress = new PublicKey("EozGikr54PQ9dragdPfzFrU3YxXrxXFa3c8nQxWZ7uY3");
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


(async () => {
    const result = await isATA(ownerPubkey, mintPubkey, tokenAccountAddress);

    if (result) {
      console.log(`${tokenAccountAddress.toBase58()} is an ATA.`);
    } else {
      console.log(`${tokenAccountAddress.toBase58()} isn't an ATA.`);
    }
})();

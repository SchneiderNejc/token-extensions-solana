Source: https://solana.com/developers/guides/token-extensions/interest-bearing-tokens

The InterestBearingConfig extension enables developers to set an interest rate stored directly on the Mint Account. Interest is compounded continuously, based on the network's timestamp.

When users deposit tokens:
-The total supply in the mint account increases.
-The interest calculation is adjusted to account for the new total supply, allowing users to benefit from the increased token amount.

Example Calculation:
1. Initial Deposit: User deposits 1000 tokens in the mint account.
2. Interest Rate: The annual interest rate is 5%.
3. Interest Accrual: After 1 year, the interest accrued would be calculated as:
Interest=1000×0.05=50 tokens
4. Total Balance After 1 Year:
Total=Initial Deposit+Interest=1000+50=1050 tokens
5. The user can now withdraw 1050 tokens from the mint account.

Scripts: 
createMint.js		Handles the creation of a new mint account.
updateInterestRate.js	Updates the interest rate for an existing mint account.

fetchMintData.js	Retrieves and logs the mint account data.
getInterestConfig.js	Retrieves and logs the interest configuration for a mint account.


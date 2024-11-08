Source: https://solana.com/developers/guides/token-extensions/non-transferable
https://spl.solana.com/token-2022/extensions

The NonTransferable extension makes it possible to create tokens that cannot be transferred. While these tokens cannot be transferred, the owner can still burn tokens and close the Token Account. This prevents users from being "stuck" with an unwanted asset.

This extension is very similar to issuing a token and then freezing the account, but allows the owner to burn and close the account if they want.

Scripts
createMint.js	Create mint with non-transferable extension.
createTA.js	Create Token account associated with user.
mintToken.js	Mint Tokens to Token account.
burn		Burn tokens amount from Token account.

CLI
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --enable-non-transferable

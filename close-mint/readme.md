Source: https://solana.com/developers/guides/token-extensions/mint-close-authority

The MintCloseAuthority extension introduces a solution to this limitation by allowing a designated Close Authority to close a Mint Account if the supply of the mint is 0. This feature provides a mechanism to recover SOL allocated to Mint Accounts that are no longer in use.

Scripts:

createMint.js		Create a new mint account with close authority extension.
closeMint.js		Close a mint account.

Source: https://spl.solana.com/token-2022/extensions

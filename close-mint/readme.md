# Mint Close Authority Extension

The MintCloseAuthority extension introduces a solution to this limitation by allowing a designated Close Authority to close a Mint Account if the supply of the mint is 0. This feature provides a mechanism to recover SOL allocated to Mint Accounts that are no longer in use.

## Scripts:

- **createMint.js**
  Create a new mint account with the close authority extension.
- **closeMint.js**
  Close a mint account.

## CLI

```sh
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --enable-close
spl-token close-mint C47NXhUTVEisCfX7s16KrxYyimnui7HpUXZecE2TmLdB
```

## Source

- [Solana: Mint Close Authority Extension](https://solana.com/developers/guides/token-extensions/mint-close-authority)
- [SPL Token Extensions](https://spl.solana.com/token-2022/extensions)

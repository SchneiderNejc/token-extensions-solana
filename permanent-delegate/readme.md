# Permanent Delegate

With Token-2022, it's possible to specify a permanent account delegate for a mint. This authority has unlimited delegate privileges over any account for that mint, meaning that it can burn or transfer any amount of tokens.

While this feature has room for abuse, it has many important real-world use cases.
For example, in some jurisdictions, a stablecoin issuer must be able to seize assets from sanctioned entities. Through the permanent delegate, the stablecoin issuer can transfer or burn tokens from accounts owned by sanctioned entities.

## Scripts

- **index.js**
  Includes createMint, createTA, mintTokens, transferTokens, burnTokens.

## Source

- [Solana: Permanent Delegate](https://solana.com/developers/guides/token-extensions/permanent-delegate)
- [Token 2022](https://spl.solana.com/token-2022)

CLI:

```sh
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --enable-permanent-delegate
spl-token authorize 7LUgoQCqhk3VMPhpAnmS1zdCFW4C6cupxgbqWrTwydGx permanent-delegate GFMniFoE5X4F87L9jzjHaW4MTkXyX1AYHNfhFencgamg
```

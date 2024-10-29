Source: https://solana.com/developers/guides/token-extensions/immutable-owner

If the owner of an existing Associated Token Account is changed, users may unintentionally transfer funds to an account under the assumption 
that it belongs to the original owner.
With Token Extensions, Associated Token Accounts have the ImmutableOwner extension enabled by default, preventing the ownership from being changed.
The ImmutableOwner extension can also be enabled for any new Token Account created by the Token Extension program.


Commands:
npm init -y
npm install @solana/web3.js @solana/spl-token
ensure wallet is present in ~/.config/solana/id.json.

update corresponding mint/TA publicKey in each script.
node createMint.js
node createATA.js
node setAccountOwner.js
node initImmutableOwnerTA.js

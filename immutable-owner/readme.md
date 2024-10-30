Source: https://solana.com/developers/guides/token-extensions/immutable-owner

If the owner of an existing Associated Token Account is changed, users may unintentionally transfer funds to an account under the assumption 
that it belongs to the original owner.
With Token Extensions, Associated Token Accounts have the ImmutableOwner extension enabled by default, preventing the ownership from being changed.
The ImmutableOwner extension can also be enabled for any new Token Account created by the Token Extension program.

Why Use the ImmutableOwner Extension Explicitly for Non-ATA Accounts?
While ATAs are immutable by default, standard token accounts (i.e., non-ATAs) created under the Token-2022 program do not have the ImmutableOwner extension applied by default. This means:

If you create a standard token account (not an ATA), you still have the option to make it mutable or immutable.
In cases where ownership immutability is desired for a standard token account, you need to explicitly enable the ImmutableOwner extension when creating it.


Commands
npm init -y
npm install @solana/web3.js @solana/spl-token
ensure wallet is present in ~/.config/solana/id.json.

Main Scripts:
update corresponding mint/TA publicKey in each script.
node createMint.js		Create a new mint.
node createATA.js		Create ATA for new mint. Has immutable owner by default.

Optional scripts:
node setAccountOwner.js		Change account owner. Will fail with immutable owner TA.
node initImmutableOwnerTA.js	Explicitly create immutable owner TA. Result is the same as using createMint + createATA. Suitable for runnint on standard TAs.
node isATA.js			Is existing TA an ATA? Should return true/false, but it's always false.


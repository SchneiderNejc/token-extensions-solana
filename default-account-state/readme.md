Source: https://solana.com/developers/guides/token-extensions/default-account-state

The DefaultAccountState extension provides the option to have all new Token Accounts to be frozen by default. With this configuration, Token Accounts must first be thawed (unfrozen) by the Freeze Authority of the mint before they become usable.


Commands:
npm init -y
npm install @solana/web3.js @solana/spl-token
npm install --save-dev @types/node

Run:
node validateWallet.js
node createMint.js
node createTokenAccount.js
node thawAccount.js
node updateDefaultAccountState.js

Do not forget to update addresses inside scripts before running them.
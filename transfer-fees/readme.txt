Source: https://solana.com/developers/guides/token-extensions/transfer-fee
https://spl.solana.com/token-2022/extensions#required-memo-on-transfer

With Token-2022, it's possible to configure a transfer fee on a mint so that fees are assessed at the protocol level. On every transfer, some amount is withheld on the recipient account, untouchable by the recipient. These tokens can be withheld by a separate authority on the mint.

Important note: Transferring tokens with a transfer fee requires using transfer_checked or transfer_checked_with_fee instead of transfer. Otherwise, the transfer will fail.

Transfer fee configurations contain a few important fields:

Fee in basis points: fee assessed on every transfer, as basis points of the transfer amount. For example, with 50 basis points, a transfer of 1,000 tokens yields 5 tokens
Maximum fee: cap on transfer fees. With a maximum fee of 5,000 tokens, even a transfer of 10,000,000,000,000 tokens only yields 5,000 tokens
Transfer fee authority: entity that can modify the fees
Withdraw withheld authority: entity that can move tokens withheld on the mint or token accounts

Scripts
createMint.js
createTAs.js
mintTokens.js
transferTokens.js


CLI
Creating a mint
$ spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --transfer-fee 50 5000
Transferring tokens with the fee checked
$ spl-token create-account Dg3i18BN7vzsbAZDnDv3H8nQQjSaPUTqhwX41J7NZb5H
$ spl-token mint Dg3i18BN7vzsbAZDnDv3H8nQQjSaPUTqhwX41J7NZb5H 1000000000
$ spl-token transfer --expected-fee 0.000005 Dg3i18BN7vzsbAZDnDv3H8nQQjSaPUTqhwX41J7NZb5H 1000000 destination.json
Find accounts with withheld tokens
CLI support coming soon!
Withdraw withheld tokens from accounts
$ spl-token withdraw-withheld-tokens 7UKuG4W68hW9eGrDms6BenRf8DCEHKGN49xewtWyB5cx 5wY8fiMZG5wGbQmtzKgqqEEp4vsCMJZ53RXEagUUWhEr
Harvest withheld tokens to mint
$ spl-token close --address 5wY8fiMZG5wGbQmtzKgqqEEp4vsCMJZ53RXEagUUWhEr
Withdraw withheld tokens from mint
$ spl-token withdraw-withheld-tokens --include-mint 7UKuG4W68hW9eGrDms6BenRf8DCEHKGN49xewtWyB5cx



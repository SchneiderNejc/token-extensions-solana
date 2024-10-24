Source: https://solana.com/developers/guides/token-extensions/getting-started

The Token Extensions program has the programID TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb 
and is a superset of the original functionality provided by the Token Program at 
TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA.

use the Solana Tool Suite to create tokens with a CLI. Based on the extension you want to create, your command flags may be different.
Extension		CLI Flag
Mint Close Authority	--enable-close
Transfer Fees		--transfer-fee <basis points> <max fee>
Non-Transferable	--enable-non-transferable
Interest-Bearing	--interest-rate <rate>
Permanent Delegate	--enable-permanent-delegate
Transfer Hook		--transfer-hook <programID>
Metadata		--enable-metadata
Metadata Pointer	--metadata-address <accountId>
Confidential Transfers	--enable-confidential-transfers auto

You enable some extensions on a token account instead of the mint, which you can also find the required flags for each below.

Extension			CLI Flag
Immutable Owner			Included by default
Required Memo on Transfer	enable-required-transfer-memos
CPI Guard			enable-cpi-guard
Default Account State		--default-account-state <state>

Create new token
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  create-token --interest-rate 5 --enable-metadata


##  !Most extensions cannot be added after the token mint is created.

The following extension combinations either do not work together, or will not make sense to combine:

Non-transferable + (transfer hooks, transfer fees, confidential transfer)
Confidential transfer + fees (until 1.18)
Confidential transfer + transfer hooks (these transfers can only see source / destination accounts, therefore cannot act on the amount transferred)
Confidential transfer + permanent delegate

Transfer Hooks
Instead of a normal transfer, any developer can insert custom logic into a program to be used with the transfer hook extension. 
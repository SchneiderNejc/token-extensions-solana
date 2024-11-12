Source: https://solana.com/developers/guides/token-extensions/required-memo
https://spl.solana.com/token-2022/extensions#required-memo-on-transfer

This feature is particularly useful for adding context to transactions, making it easier to understand their purpose when reviewing the transaction logs later.

Traditional banking systems typically require a memo to accompany all transfers. By enabling required memo transfers on your token account, the program enforces that all incoming transfers must have an accompanying memo instruction right before the transfer instruction.

Scripts
createMint.js	Creates mint and TA with memo
enableMemo.js	Enable/Disable memo for created TA.

CLI
Create account with required memo transfers
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token
spl-token create-account EbPBt3XkCb9trcV4c8fidhrvoeURbDbW87Acustzyi8N
spl-token enable-required-transfer-memos 4Uzz67txwYbfYpF8r5UGEMYJwhPAYQ5eFUY89KTYc2bL

Enabling or disabling required memo transfers
spl-token disable-required-transfer-memos 4Uzz67txwYbfYpF8r5UGEMYJwhPAYQ5eFUY89KTYc2bL
spl-token enable-required-transfer-memos 4Uzz67txwYbfYpF8r5UGEMYJwhPAYQ5eFUY89KTYc2bL

Transferring with a memo
spl-token transfer EbPBt3XkCb9trcV4c8fidhrvoeURbDbW87Acustzyi8N 10 4Uzz67txwYbfYpF8r5UGEMYJwhPAYQ5eFUY89KTYc2bL --with-memo "memo text"
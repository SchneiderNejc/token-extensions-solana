Source: https://solana.com/developers/guides/token-extensions/metadata-pointer

The MetadataPointer extension now enables a Mint Account to specify the address of its corresponding Metadata Account.
With the TokenMetadata extension, the Mint Account itself can now store the metadata.

The Metadata Interface specifies the following instructions:

Initialize: Initialize the basic token metadata fields (name, symbol, URI).
UpdateField: Updates an existing token metadata field or adds to the additional_metadata if it does not already exist. Requires resizing the account to accommodate for addition space.
RemoveKey: Deletes a key-value pair from the additional_metadata. This instruction does not apply to the required name, symbol, and URI fields.
UpdateAuthority: Updates the authority allowed to change the token metadata.
Emit: Emits the token metadata in the format of the TokenMetadata struct. This allows account data to be stored in a different format while maintaining compatibility with the Interface standards.

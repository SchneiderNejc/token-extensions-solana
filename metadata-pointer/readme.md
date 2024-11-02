Source: https://solana.com/developers/guides/token-extensions/metadata-pointer

The MetadataPointer extension now enables a Mint Account to specify the address of its corresponding Metadata Account.
With the TokenMetadata extension, the Mint Account itself can now store the metadata.

The Metadata Interface specifies the following instructions:

Initialize: Initialize the basic token metadata fields (name, symbol, URI).
UpdateField: Updates an existing token metadata field or adds to the additional_metadata if it does not already exist. Requires resizing the account to accommodate for addition space.
RemoveKey: Deletes a key-value pair from the additional_metadata. This instruction does not apply to the required name, symbol, and URI fields.
UpdateAuthority: Updates the authority allowed to change the token metadata.
Emit: Emits the token metadata in the format of the TokenMetadata struct. This allows account data to be stored in a different format while maintaining compatibility with the Interface standards.

Scripts: 
1. initConnection.js 		Creates the Solana connection and prepares necessary constants.
2. createMintAccount.js  	Sets up the new mint account.
3. initMetadataPointer.js	Initializes the metadata pointer.
4. initMetadata.js  		Adds metadata to the mint.
5. updateMetadataField.js  	Updates a metadata field.
6. removeMetadataField.js 	Removes a metadata field.
7. fetchMetadata.js 		Fetches and logs metadata information.

Running Scripts
You can specify commands and parameters when running main.js:
Create a Mint Account:	node main.js createMint
Init Metadata Pointer:	node main.js initPointer <mintPublicKey>
Initialize Metadata:	node main.js initMetadata <mintPublicKey>
Update Metadata Field: 	node main.js updateField <mintPublicKey> description "Only Possible On Solana"
Remove Metadata Field: 	node main.js removeField <mintPublicKey> description
Fetch Metadata: 	node main.js fetchMetadata <mintPublicKey>
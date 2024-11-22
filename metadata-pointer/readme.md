# MetadataPointer Extension

The MetadataPointer extension now enables a Mint Account to specify the address of its corresponding Metadata Account.
With the TokenMetadata extension, the Mint Account itself can now store the metadata.

The Metadata Interface specifies the following instructions:

- **Initialize**: Initialize the basic token metadata fields (name, symbol, URI).
- **UpdateField**: Updates an existing token metadata field or adds to the additional_metadata if it does not already exist. Requires resizing the account to accommodate additional space.
- **RemoveKey**: Deletes a key-value pair from the additional_metadata. This instruction does not apply to the required name, symbol, and URI fields.
- **UpdateAuthority**: Updates the authority allowed to change the token metadata.
- **Emit**: Emits the token metadata in the format of the TokenMetadata struct. This allows account data to be stored in a different format while maintaining compatibility with the Interface standards.

If the token program being used is SPL Token-2022, the mint will be initialized with both closing mint and metadata pointer extensions.

## Scripts

1. **initConnection.js**
   Creates the Solana connection and prepares necessary constants.
2. **createMintAccount.js**
   Sets up the new mint account.
3. **initMetadataPointer.js**
   Initializes the metadata pointer.
4. **initMetadata.js**
   Adds metadata to the mint.
5. **updateMetadataField.js**
   Updates a metadata field.
6. **removeMetadataField.js**
   Removes a metadata field.
7. **fetchMetadata.js**
   Fetches and logs metadata information.

## Running Scripts

You can specify commands and parameters when running `main.js`:

- **Create a Mint Account**:
  `node main.js createMint`
- **Init Metadata Pointer**:
  `node main.js initPointer EDtYTDYygvf1S3i48UAY8sE92tUoHuTcaxRgXjR66MX1`
- **Update Metadata Field**:
  `node main.js updateField <mintPublicKey> someKey someValue`
- **Remove Metadata Field**:
  `node main.js removeField <mintPublicKey> someKey`
- **Fetch Metadata**:
  `node main.js fetchMetadata <mintPublicKey>`

## Running commands through CLI

### create mint with metadata

```sh
$ spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --enable-metadata
Creating token 5K8RVdjpY3CHujyKjQ7RkyiCJqTG8Kba9krNfpZnmvpS under program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

### initialize metadata inside the mint

```sh
$ spl-token initialize-metadata DodV53TZ8DZ8Mfu6qnZGTrTtwcdBb51zFanMzZQeS2gR "NAME" "SMBL" "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json"
```

```sh
$ spl-token initialize-metadata 5K8RVdjpY3CHujyKjQ7RkyiCJqTG8Kba9krNfpZnmvpS MyTokenName TOKEN http://my.token --update-authority 3pGiHDDek35npQuyWQ7FGcWxqJdHvVPDHDDmBFs2YxQj
```

### Update a field

```sh
$ spl-token update-metadata DodV53TZ8DZ8Mfu6qnZGTrTtwcdBb51zFanMzZQeS2gR new-field updated-value
Signature: 2H16XtBqdwSbvvq8g5o2jhy4TknP6zgt71KHawEdyPvNuvusQrV4dPccUrMqjFeNTbk75AtzmzUVueH3yWiTjBCG
```

### Add a custom field

```sh
$ spl-token update-metadata DodV53TZ8DZ8Mfu6qnZGTrTtwcdBb51zFanMzZQeS2gR new-field new-value
Signature: 31uerYNa6yhb21k5CCX69k7RLUKEhJEV99UadEpPnZtWWpykwr7vkTFkuFeJ7AaEyQPrepe8m8xr4N23JEAeuTRY
```

### Remove a custom field

```sh
$ spl-token update-metadata DodV53TZ8DZ8Mfu6qnZGTrTtwcdBb51zFanMzZQeS2gR new-field2 new-field3 --remove
Signature: 52s1mxRqnr2jcZNvcmcgsQuXfVyT2w1TuRsEE3J6YwEZBu74BbFcHh2DvwnJG7qC7Cy6C5ZrTfnoPREFjFS7kXjF
```

## Source

- [Solana: MetadataPointer Extension](https://solana.com/developers/guides/token-extensions/metadata-pointer)
- [Token 2022 Extensions](https://spl.solana.com/token-2022/extensions)

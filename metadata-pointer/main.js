const fs = require('fs');
const { createMintAccount } = require('./scripts/createMintAccount');
const { initializeMetadataPointer } = require('./scripts/initMetadataPointer');
const { initializeMetadata } = require('./scripts/initMetadata');
const { updateMetadataField } = require('./scripts/updateMetadataField');
const { removeMetadataField } = require('./scripts/removeMetadataField');
const { fetchMetadata } = require('./scripts/fetchMetadata');
const { connection, payer } = require('./scripts/initConnection');

// Command-line arguments: node main.js <command> [parameters...]
const command = process.argv[2];

// Function to save output to a file
const saveOutputToFile = (filename, data) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

const runScript = async () => {
    let mint, updateAuthority;

    switch (command) {
        case 'createMint':
            const mintAccount = await createMintAccount();
            mint = mintAccount.mint.toBase58();
            console.log(`Mint Account Created: ${mint}`);
            saveOutputToFile('output/mint.txt', { mint });
            break;

        case 'initPointer':
            mint = process.argv[3]; // Get mint from arguments
            updateAuthority = payer.publicKey; // Default update authority
            await initializeMetadataPointer(mint, updateAuthority);
            break;

        case 'initMetadata':
            mint = process.argv[3]; // Get mint from arguments
            updateAuthority = payer.publicKey; // Default update authority
            await initializeMetadata(mint, updateAuthority);
            break;

        case 'updateField':
            mint = process.argv[3]; // Get mint from arguments
            const field = process.argv[4];
            const value = process.argv[5];
            await updateMetadataField(mint, field, value);
            break;

        case 'removeField':
            mint = process.argv[3]; // Get mint from arguments
            const key = process.argv[4];
            await removeMetadataField(mint, key);
            break;

        case 'fetchMetadata':
            mint = process.argv[3]; // Get mint from arguments
            const metadata = await fetchMetadata(mint);
            console.log("Fetched Metadata:", metadata);
            saveOutputToFile('output/metadata.txt', metadata);
            break;

        default:
            console.log("Invalid command. Available commands are:");
            console.log("createMint, initializePointer, initializeMetadata, updateField, removeField, fetchMetadata");
            break;
    }
};

// Run the script
runScript().catch(console.error);

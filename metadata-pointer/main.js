const fs = require('fs');
const path = require("path");

const { createMint } = require('./scripts/createMint');
const { initializeMetadataPointer } = require('./scripts/initMetadataPointer');
const { updateMetadataField } = require('./scripts/updateMetadataField');
const { removeMetadataField } = require('./scripts/removeMetadataField');
const { fetchMetadata } = require('./scripts/fetchMetadata');
const { payer } = require('./scripts/initConnection');

// Command-line arguments: node main.js <command> [parameters...]
const command = process.argv[2];

// Ensure the output directory exists
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

const runScript = async () => {
    let mint, updateAuthority;

    switch (command) {
        case 'createMint':
          mint = await createMint();
          fs.writeFileSync(path.join(outputDir, "mint.txt"), mint.toString());
          console.log(`Mint address saved to ${outputDir}/mint.txt`);
          break;

        case 'initPointer':
            mint = process.argv[3]; // Get mint from arguments
            updateAuthority = payer.publicKey; // Default update authority
            await initializeMetadataPointer(mint, updateAuthority);
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
            fs.writeFileSync(path.join(outputDir, "metadata.json"), JSON.stringify(metadata, null, 2));
            console.log(`Metadata saved to ${outputDir}/metadata.json`);
            break;

        default:
            console.log("Invalid command. Available commands are:");
            console.log("createMint, initializePointer, initializeMetadata, updateField, removeField, fetchMetadata");
            break;
    }
};

// Run the script
runScript().catch(console.error);

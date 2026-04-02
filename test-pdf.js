const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    let dataBuffer = fs.readFileSync('src/assets/catalogs/rda-wires-cables.pdf');
    try {
        const data = await pdf(dataBuffer);
        console.log("--- Extracted text begins ---");
        console.log(data.text);
        console.log("--- Extracted text ends ---");
    } catch (e) {
        console.error(e);
    }
}
extract();

const fs = require('fs');
const path = require('path');
const transactionsPath = path.join(__dirname, 'transactions', '/')
const scriptsPath = path.join(__dirname, 'scripts', '/')

const convertCadenceToJs = async () => {
    let resultingJs = await require('cadence-to-json')({
        transactions: [ transactionsPath ],
        scripts: [ scriptsPath ],
        config: require('../flow.json')
    })
      
    fs.writeFile('./flow/CadenceToJson.json', JSON.stringify(resultingJs), (err) => {
        if (err) {
            console.error("Failed to read CadenceToJs JSON");
            console.error(err)
            process.exit(1)
        }
    })
}

convertCadenceToJs()
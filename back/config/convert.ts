// const csvToJSON=require("csvtojson");
// const path = require('path');
// const childProcess = require('child_process');
// const fs = require('fs');
// const glob = require('glob');
// const mkdirp = require('mkdirp');


// const writeFile = (p, ...args) => {
//     fs.writeFileSync(p, ...args);
// };


// const convert = async () => {
//     const fileNames = [{src: 'TableStat.csv', dest: 'stat.json'}]

// // {src: 'TableUser.csv', dest: 'profile.json'}
// // {src: 'TablePlay.csv', dest: 'play.json'}, 
//     await Promise.all(fileNames.map(async file => {
//         const {src, dest} = file
//         const destFile = path.join(__dirname, `./seed/${dest}`);
//         const srcFile = path.join(__dirname, `../../backups__r1__sept27/${src}`);
//         const jsonData = await csvToJSON().fromFile(srcFile)
//         console.log('Transformed JSON data: ', jsonData)

//         writeFile(destFile, JSON.stringify(jsonData))

//     }))

// }

// convert()

// cat ./backups__r1__sept27/TableUser.csv | csvtojson --ignoreEmpty=true > ./back/config/seed/TableUser.json
// // node dynamoDBtoCSV.js -t sp-app-back-rc-TableAchievements  -e dynamodb.us-east-1.amazonaws.com -f ./backups__r1__sept27/TableUser.csv
// cat ./backups__rc__sept27/TableAchievement.csv | csvtojson --ignoreEmpty=true > ./back/config/seed/TableAchievement.json
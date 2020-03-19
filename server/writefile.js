const fs = require('fs')
const path = require('path')
const readline = require('readline');
const nodejieba = require("nodejieba");
const MongoClient = require('mongodb').MongoClient;
const MongoConnection = require('./connection')
var LineReaderSync = require("line-reader-sync")
const w_filePath = ".\\books\\testfile"
const filePath = "D:\\ettoday"
var line;
var count = 0;
var start = 0;
var end = 0;
var total = 0;
nodejieba.load({
    userDict: './userdict.txt',
});
var url = ''
var title = ''
var text = ''
var text_tag = 0 //判斷@B
var bulkOps = []
var bulkcount = 0
async function parseFile() {

    var inputStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    // 將讀取資料流導入 Readline 進行處理 

    var lineReader = readline.createInterface({ input: inputStream });

    lineReader.on('line', function (line) {
        // console.log(line)
        if (line === null) {
            console.log("EOF");
            return;
        }
        // 新增內容至檔案(不覆蓋)
        fs.appendFile(w_filePath, line + '\n', function (err) {
            if (err)
                console.log(err);
            else {
                count += 1
                console.log(count)
            }

        });

    });
    // }
}




/** Clear ES index, parse and index all files from the books directory */
async function readAndInsert() {
    try {
        // Create index with mongodb
        // await MongoConnection.CreateIndex()

        // let files = fs.readFileSync('D:\\ettoday').toString();
        // let files = fs.readFileSync('D:\\ettoday')
        // console.log(files)
        // 同
        // let files = fs.readdirSync('./books').filter(function (file) {
        //   return file.slice(-4) === '.txt';
        // });
        // console.log(`Found ${files.length} Files`)
        // test tiime consuming
        // console.time('test time');
        // Read each news file, and bulk insert  in mongodb
        // start = new Date().getTime();
        // for (let file of files) {
        //     console.log(`Reading File - ${file}`)
        //     const filePath = path.join('.\\books', file)
        //     console.log("t1")
        //     parseFile(filePath)
        //     console.log("t2")
        //         // resolve()

        // }
        // console.timeEnd('test time');
    } catch (err) {
        console.error(err)
    }
}

// readAndInsert()
parseFile()
const fs = require('fs')
const path = require('path')
const readline = require('readline');
const nodejieba = require("nodejieba");
const MongoClient = require('mongodb').MongoClient;
const MongoConnection = require('./connection')
var LineReaderSync = require("line-reader-sync")
// const filePath = ".\\books\\row_data"
const filePath = "D:\\ettoday"
var count = 0
var flag = 0 //text寫完
var c = 0
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
function writefile() {
    lrs = new LineReaderSync(filePath)
    while (true) {
        line = lrs.readline()
        if (line === null) {
            console.log("EOF");
            break;
        }

        fs.appendFile('testfile', line, function (err) {
            if (err)
                console.log(err);
        });



    }
}


writefile()
const fs = require('fs')
var jsonFile = require('jsonfile')
const path = require('path')
const esConnection = require('./connection2')
// const filePath = "./data/daily_processing.json"
// const filePath = "./data/todayTrainFre.json"
const filePath = "../news/News.json"
var jsonData = jsonFile.readFileSync(filePath);
// console.log("\n *START* \n");
// var content = fs.readFileSync(filePath);
// console.log("Output Content : \n"+ content);
// console.log("\n *EXIT* \n");

// for (var i = 0; i < jsonData.length; ++i) {

// 	console.log("Emp ID : "+jsonData[i].description);
// 	// console.log("Emp Name : "+jsonData[i].emp_name);
// 	// console.log("Emp Address : "+jsonData[i].emp_addr);
// 	// console.log("Designation : "+jsonData[i].designation);
// 	console.log("----------------------------------");
// }
function parseFile() {
    let bulkOps = [] // Array to store bulk operations
    let bulkcount = 0
    console.log("\n *START* \n");
    jsonFile.readFile(filePath, function (err, jsonData) {
        // if (err) throw err;
        for (var i = 0; i < jsonData.length; ++i) {

            //   console.log("website: "+jsonData[i].website);
            //   console.log("url: "+jsonData[i].url);
            //   console.log("title: "+jsonData[i].title);
            //   console.log("date: "+jsonData[i].date);
            //   console.log("content: "+jsonData[i].content);
            // console.log("keywords: " + jsonData[i].keywords);
            //   console.log("category: "+jsonData[i].category);
            //   console.log("image: "+jsonData[i].image);
            //   console.log("description: "+jsonData[i].description);
            if( jsonData[i].image=="https://uc.udn.com.tw/upf/news/2017/images/icon_APP.jpg"){
                bulkcount += 1
                bulkOps.push({
                    index: {
                        _index: esConnection.index,
                        _type: esConnection.type
                    }
                })
                bulkOps.push({
                    website: jsonData[i].website,
                    url: jsonData[i].url,
                    title: jsonData[i].title,
                    date: jsonData[i].date,
                    content: jsonData[i].content,
                    category: jsonData[i].category,
                    keywords: jsonData[i].keywords,
                    vectors: jsonData[i].vectors,
                    image: jsonData[i].image,
                    description: jsonData[i].description
    
    
                })
            }
            else if( jsonData[i].image=="https://talk.ltn.com.tw/assets/images/logo180x180.png"){
                bulkcount += 1
                bulkOps.push({
                    index: {
                        _index: esConnection.index,
                        _type: esConnection.type
                    }
                })
                bulkOps.push({
                    website: jsonData[i].website,
                    url: jsonData[i].url,
                    title: jsonData[i].title,
                    date: jsonData[i].date,
                    content: jsonData[i].content,
                    category: jsonData[i].category,
                    keywords: jsonData[i].keywords,
                    vectors: jsonData[i].vectors,
                    image: jsonData[i].image,
                    description: jsonData[i].description
    
    
                })
            }
            else if( jsonData[i].image=="https://news.ltn.com.tw/assets/images/all/250_ltn.png"){
                bulkcount += 1
                bulkOps.push({
                    index: {
                        _index: esConnection.index,
                        _type: esConnection.type
                    }
                })
                bulkOps.push({
                    website: jsonData[i].website,
                    url: jsonData[i].url,
                    title: jsonData[i].title,
                    date: jsonData[i].date,
                    content: jsonData[i].content,
                    category: jsonData[i].category,
                    keywords: jsonData[i].keywords,
                    vectors: jsonData[i].vectors,
                    image: jsonData[i].image,
                    description: jsonData[i].description
    
    
                })
            }
            else if( jsonData[i].image=="https://img.appledaily.com.tw/images/fb_sharelogo_1.jpg"){
                bulkcount += 1
                bulkOps.push({
                    index: {
                        _index: esConnection.index,
                        _type: esConnection.type
                    }
                })
                bulkOps.push({
                    website: jsonData[i].website,
                    url: jsonData[i].url,
                    title: jsonData[i].title,
                    date: jsonData[i].date,
                    content: jsonData[i].content,
                    category: jsonData[i].category,
                    keywords: jsonData[i].keywords,
                    vectors: jsonData[i].vectors,
                    image: jsonData[i].image,
                    description: jsonData[i].description
    
    
                })
            }
       
            else if( jsonData[i].image.length<10){
                bulkcount += 1
                bulkOps.push({
                    index: {
                        _index: esConnection.index,
                        _type: esConnection.type
                    }
                })
                bulkOps.push({
                    website: jsonData[i].website,
                    url: jsonData[i].url,
                    title: jsonData[i].title,
                    date: jsonData[i].date,
                    content: jsonData[i].content,
                    category: jsonData[i].category,
                    keywords: jsonData[i].keywords,
                    vectors: jsonData[i].vectors,
                    image: jsonData[i].image,
                    description: jsonData[i].description
    
    
                })
            }


        }
        console.log(`bulkcount: ${bulkcount}`)
        esConnection.client.bulk({
            body: bulkOps
        })
        // end = new Date().getTime();
        // console.log((end - start) / 1000 + "sec");
        bulkOps = []
        // console.log("插入完成")
        // console.log("total: " + total);
    });

}


function readAndInsert() {
    try {

        // esConnection.resetIndex()
        // console.time('test time');
        // esConnection.resetIndex()
        parseFile()


    } catch (err) {
        console.error(err)
    }
}

// readAndInsert()
readAndInsert()
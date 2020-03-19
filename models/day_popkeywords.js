// var mongodb = require('./db');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../settings');
const connectionString = 'mongodb://localhost:27017/';
// var date = new Date();
// var YTD = date.setDate(date.getDate() - 1);
var TODAY = new Date().toISOString().slice(0, 10)
// var YTD = '2019-05-24'
module.exports = async function (newsCat) {
    // do something
    const db = await MongoClient.connect(connectionString + settings.db);
    // if (err) {
    //     throw err;
    // }
    // 读取 users 集合 
    const MyCollection = db.collection('day_popkeywords');
    const docs = await MyCollection.findOne({
        "date": TODAY
    });
    // console.log(TODAY)
    for (var key in docs) {
        // check if the property/key is defined in the object itself, not in parent
        // if (docs.hasOwnProperty(key)) {           
        //     console.log(key, docs[key]);
        // }
        if(key=="pop_cat"){
            // console.log(docs[key][newsCat])
            return docs[key][newsCat]
        }
    }
    // console.log(docs)
    // console.log(docs[newsCat])
    // db.collection('day_popkeywords', async function (err, collection) {
    //     if (err) {
    //         db.close();
    //         throw err;
    //     }

    //     collection.findOne({ date: YTD }, async function (err, doc) {

    //         if (doc) {

    //             // console.log(doc[newsCat])

    //             // console.log(newsCat)
    //             // console.log(doc[newsCat])
    //             const words = doc[newsCat]
    //             console.log(words)
    //             return words;
    //             // return cat;
    //             // callback(err, doc.viewNews);
    //         } else {
    //             return null;
    //         }
    //         // db.close();
    //     });
    // });


}
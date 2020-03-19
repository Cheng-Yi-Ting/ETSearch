// var mongodb = require('./db');
const MongoClient = require('mongodb').s;
const settings = require('../settings');
const connectionString = 'mongodb://localhost:27017/';

module.exports = async function(user, url) {
    // do something
    let is_find = 'no';
    const db = await MongoClient.connect(connectionString + settings.db);
    // if (err) {
    //     throw err;
    // }
    // 读取 users 集合 
    // const temp = await db.collection("users").findOne(
    //     { name: user },
    //     // { rating: { url: url } }
    // )
    // console.log(url)
    const temp = await db.collection("users").findOne({
        $and: [
            { name: user },
            { rating: { $elemMatch: { url: url } } }
        ]

    })

    const MyCollection = db.collection('users');
    const doc = await MyCollection.findOne({
        name: user
    });
    if (doc == null) {
        return null
    }
    for (i = 0; i < doc.rating.length; i++) {
        if (url == doc.rating[i]["url"]) {
            is_find = 'yes'
        }

    }
    return is_find;


}
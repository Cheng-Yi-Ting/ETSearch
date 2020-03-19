// var mongodb = require('./db');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../settings');
const connectionString = 'mongodb://localhost:27017/';

module.exports = async function () {
    // do something
    const db = await MongoClient.connect(connectionString + settings.db);
    // if (err) {
    //     throw err;
    // }
    // 读取 users 集合 
    const MyCollection = db.collection('random_news');
    const docs = await MyCollection.findOne({
    });
    if (docs.news) {
        return docs.news;
    }
    else {
        return null
    }




}
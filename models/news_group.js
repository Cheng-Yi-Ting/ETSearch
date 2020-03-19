// var mongodb = require('./db');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../settings');
const connectionString = 'mongodb://localhost:27017/';

module.exports = async function (url) {
    // do something
    const db = await MongoClient.connect(connectionString + settings.db);
    // if (err) {
    //     throw err;
    // }
    // 读取 users 集合 
    const MyCollection = db.collection('news_group');
    const docs = await MyCollection.findOne({
        news: url
    });
    // 沒有相關新聞
    if (docs == null) {
        return null
    }
    return docs['group_news']



}
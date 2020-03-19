// var mongodb = require('./db');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../settings');
const connectionString = 'mongodb://localhost:27017/';

module.exports = async function (from) {
    // do something
    const db = await MongoClient.connect(connectionString + settings.db);
    // if (err) {
    //     throw err;
    // }
    // 读取 users 集合 
    const end = (from * 1) + 40
    const MyCollection = db.collection('today_pop_news');
    const docs = await MyCollection.findOne({
    });
    if (docs.today_pop_news) {
        pop_news = docs.today_pop_news.slice(from, end)
        pop_newsLen = docs.today_pop_news.length
    }
    else {
        return null
    }
    // rec_news = doc.recNews.slice(from, end)
    // const end = (from * 1) + 40

    return ({ pop_news, pop_newsLen })



}
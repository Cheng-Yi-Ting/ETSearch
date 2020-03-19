const elasticsearch = require('elasticsearch')

// Core ES variables for this project
// const index = 'ettoday'
// const type = 'news'
const port = 9200
const host = process.env.ES_HOST || 'localhost'
const client = new elasticsearch.Client({ host: { host, port } })
let date = require('date-and-time');
// const dateFormat = require('dateformat');
// const now = new Date();

let now = new Date(); //今天日期
now = date.format(now, 'YYYY-MM-DD'); // 轉換格式=> '2019-02-08'
console.log('-------------------------------------------')
    // term = '韓國瑜'
now = "2018-12-26" //Temp
client.search({
    index: 'information',
    type: 'news',
    body: {
        from: 10,
        size: 10,
        "query": {
            "multi_match": {
                "query": now,
                "fields": ["date", "date"],
                // "query": term,
                // "fields": ["content", "text"]
            }
        }
        // "from": 0,
        // "size": 10000

    }
}).then(function(resp) {
    var hits = resp.hits.hits;
    console.log(hits)
        //     // console.log(hits.length)
        // end = new Date().getTime();
        // console.log((end - start) / 1000 + "sec");
}, function(err) {
    console.trace(err.message);
});
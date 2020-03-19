const { client, index, type } = require('./connection')
let date = require('date-and-time');
let now = new Date(); //今天日期
now = date.format(now, 'YYYY-MM-DD'); // 轉換格式=> '2019-02-08'
term = '桃園市'
now = "2019-02-18" //Temp date


module.exports = {
    /** Query ES index for the provided term */

    queryTerm(offset = 0) {
        client.search({
            // index: 'information',
            // type: 'news',
            from: 0,
            size: 40,
            querys: [

                { "match": { "date": now } },
                // { "match": { "title": term } },
                // { "match": { "text": term } },
                // "query": now,
                // "fields": ["date", "date"],

            ]
            // "from": 0,
            // "size": 10000

        }).then(function (resp) {
            var hits = resp.hits.hits;
            console.log("123")
            console.log(hits)
            console.log(hits.length)
            // console.log(hits)
            //     // console.log(hits.length)
            // end = new Date().getTime();
            // console.log((end - start) / 1000 + "sec");
        }, function (err) {
            console.trace(err.message);
        });
    },
}
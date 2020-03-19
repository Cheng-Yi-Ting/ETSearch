const { client, index, type } = require('./connection')
let date = require('date-and-time');
let now = new Date(); //今天日期
now = date.format(now, 'YYYY-MM-DD'); // 轉換格式=> '2019-02-08'
now = "2019-05-31" //Temp date
module.exports = {
    /** Query ES index for the provided date */
    // 每次返回40筆資料
    queryTerm(term, offset = 0) {
        const body = {
            from: offset,
            size: 40,
            "query": {
                "bool": {
                    // "must": { "match": { "date": now } },
                    // "must": { "match": { "title": term } },
                    // "must": { "match": { "content": term } },
                    "should": [
                        {
                            "match": {
                                "title": {
                                    "query": term,
                                    "boost": 3
                                    // This clause is the most important, as it has the highest boost.
                                }
                            }

                        },
                        {
                            "match": {
                                "content": {
                                    "query": term,
                                    "boost": 2
                                }
                            }

                        },
                        // { "match": { "title": term } },
                        // { "match": { "content": term } }
                    ],

                    // 即三条 should 语句中至少有1条必须匹配。
                    "minimum_should_match": 1,

                }
            },
            "sort": {

                "date": {
                    "order": "desc"
                },
                "_score": {
                    "order": "desc"
                },
            }

            // "query": {
            //     "bool": {
            //         "must": { "match": { "date": now } },
            //         // "must": { "match": { "title": term } },
            //         // "must": { "match": { "content": term } },
            //         "should": [
            //             {
            //                 "term": { "title": term },
            //                 "term": { "content": term }

            //             },
            //             // { "match": { "title": term } },
            //             // { "match": { "content": term } }
            //         ],

            //         // 即三条 should 语句中至少有1条必须匹配。
            //         "minimum_should_match": 1,

            //     }
            // }
            // highlight: { fields: { text: {} } }
        }
        return client.search({ index, type, body })
    }

}

/*
Bool query

should:

The clause(query) should appear in the matching document.If the bool query is in a query context and has a must or filter clause then a document will match the bool query even if none of the should queries match.In this case these clauses are only used to influence the score.If the bool query is in a filter context or has neither must or filter then at least one of the should queries must match a document for it to match the bool query.This behavior may be explicitly controlled by setting the minimum_should_match parameter.


boost:
The boost parameter is used to increase the relative weight of a clause (with a boost greater than 1) or decrease the relative weight (with a boost between 0 and 1), but the increase or decrease is not linear. In other words, a boost of 2 does not result in double the _score.

Instead, the new _score is normalized after the boost is applied. Each type of query has its own normalization algorithm, and the details are beyond the scope of this book. Suffice to say that a higher boost value results in a higher _score.
*/
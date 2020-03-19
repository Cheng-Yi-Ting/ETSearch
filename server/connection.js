const elasticsearch = require('elasticsearch')

// Core ES variables for this project
const index = 'information'
const type = 'news'
const port = 9200
const host = process.env.ES_HOST || 'localhost'
const client = new elasticsearch.Client({ host: { host, port } })


/** Clear the index, recreate it, and add mappings */
async function resetIndex() {
    if (await client.indices.exists({ index })) {
        await client.indices.delete({ index })
    }

    await client.indices.create({ index })
    await putBookMapping()
}

/** Add book section schema mapping to ES */
async function putBookMapping() {

    client.indices.putMapping({
        index: 'information',
        type: 'news',
        body: {
                // "_all": {
                //     "analyzer": "ik_max_word",
                //     "search_analyzer": "ik_max_word",
                //     "term_vector": "no",
                //     "store": "false"
                // },
                "properties": {
                    "website": { "type": 'string', "index": 'not_analyzed' },
                    "url": { "type": 'string', "index": 'not_analyzed' },
                    "title": {
                        "type": "text",
                        "term_vector" : "with_positions_offsets",
                        "analyzer": "ik_max_word",
                        "search_analyzer": "ik_smart",
                        // "include_in_all": "true",
                        // "boost": 8
                    },
                    "date": { "type": 'date', "index": 'not_analyzed' },
                    "content": {
                        "type": "text",
                        "term_vector" : "with_positions_offsets",
                        "analyzer": "ik_max_word",
                        "search_analyzer": "ik_smart",
                        // "include_in_all": "true",
                        // "boost": 8
                    },
                    "keywords": { "type": 'string', "index": 'not_analyzed' },
                    "vectors": { "type": 'string', "index": 'not_analyzed' },
                    "category": { "type": 'string', "index": 'not_analyzed' },
                    "image": { "type": 'string', "index": 'not_analyzed' },
                    "description": { "type": 'string', "index": 'not_analyzed' }
                }
        }

    })
}

// async function putBookMapping() {

//     client.indices.putMapping({
//         index: 'information',
//         type: 'news',
//         body: {
//                 // "_all": {
//                 //     "analyzer": "ik_max_word",
//                 //     "search_analyzer": "ik_max_word",
//                 //     "term_vector": "no",
//                 //     "store": "false"
//                 // },
//                 "properties": {
//                     "website": { "type": 'string', "index": 'not_analyzed' },
//                     "url": { "type": 'string', "index": 'not_analyzed' },
//                     "title": {
//                         "type": "text",
//                         "analyzer": "ik_max_word",
//                         "search_analyzer": "ik_smart",
//                         // "include_in_all": "true",
//                         // "boost": 8
//                     },
//                     "date": { "type": 'date', "index": 'not_analyzed' },
//                     "content": {
//                         "type": "text",
//                         "analyzer": "ik_max_word",
//                         "search_analyzer": "ik_smart",
//                         // "include_in_all": "true",
//                         // "boost": 8
//                     },
//                     "keywords": { "type": 'string', "index": 'not_analyzed' },
//                     "vectors": { "type": 'string', "index": 'not_analyzed' },
//                     "category": { "type": 'string', "index": 'not_analyzed' },
//                     "image": { "type": 'string', "index": 'not_analyzed' },
//                     "description": { "type": 'string', "index": 'not_analyzed' }
//                 }
//         }

//     })
// }

module.exports = {
    client,
    index,
    type,
    resetIndex
}
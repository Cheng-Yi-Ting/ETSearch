var mongodb = require('./db');
// var date = new Date();
// var YTD = date.setDate(date.getDate() - 1);
// var YTD = new Date().toISOString().slice(0, 10)
var YTD = '2019-03-18'
module.exports = class News {
    day_popkeywords(newsCat) {
        // do something
        console.log(YTD)
        mongodb.open(function (err, db) {
            if (err) {
                return err;
            }
            // 读取 users 集合 
            db.collection('day_popkeywords', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return err;
                }

                collection.findOne({ date: YTD }, function (err, doc) {
                    mongodb.close();
                    if (doc) {

                        // console.log(doc[newsCat])

                        // console.log(newsCat)
                        const cat = doc[newsCat]
                        // console.log(cat)
                        // return cat;
                        // callback(err, doc.viewNews);
                    } else {
                        return null;
                    }
                });
            });

        });
    }
}

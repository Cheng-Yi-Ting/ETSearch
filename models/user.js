var mongodb = require('./db');
const MongoClient = require('mongodb').MongoClient;
const settings = require('../settings');
const connectionString = 'mongodb://localhost:27017/';
/* 代码实现了两个接口， 
User.prototype.save:对象实例的方法，用于将用户对象的数据保存到数据库中
User.get:对象构造函数的方法，用于从数据 库中查找指定的用户。
 */
/*
  集合`users`的文档`User`构造函数
    @param {Object} user: 包含用户信息的一个对象
 */
// constructor
// User是一個構造函數，可以用new這個關鍵字 new 出一個 instance 來。
function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.viewNews = [];
    this.rating = [];
    this.content_based = [];
    this.user_based = [];
    this.cat_stat={'國際':0, '社會':0, '財經':0, '旅遊':0, '政治':0, '健康':0, '地方':0, '影劇':0, '體育':0, '生活':0, '寵物':0, '大陸':0};
    this.cat_based=[];
    this.user_rec=[];
    // recNews
};

module.exports = User;

/*
 * 保存一个用户到数据库
 * @param {Function} callback: 执行完数据库操作的应该执行的回调函数
 */
// 只要把 save 這個 function 指定在 User.prototype 上面，所有 User 的 instance 都可以共享這個方法。
User.prototype.save = function save(callback) {
    // 存入 Mongodb 的文档
    var user = {
        name: this.name,
        password: this.password,
        viewNews: this.viewNews,
        content_based: this.content_based,
        user_based:this.user_based,
        cat_stat:this.cat_stat,
        cat_based:this.cat_based,
        user_rec:this.user_rec,
        rating: this.rating
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 写入 user 文档 
            // safe option to save will force the driver to make sure the save succeeds and raise an error if it doesn’t.You could also declare safe in your model in order to force all operations to be safe.
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                callback(err, user);
            });
        });
    });
};

/*
 * 查询在集合`users`是否存在一个制定用户名的用户
 * @param {String} username: 需要查询的用户的名字
 * @param {Function} callback: 执行完数据库操作的应该执行的回调函数
 */
User.get = function get(username, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 查找 name 属性为 username 的文档
            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    /*
                    e.g:doc
                    { _id: 5c4479a85909af0fb4d20530,
                     name: '123',
                    password: 'ICy5YqxZB1uWSwcVLSNLcA==' }
                    */
                    // 封装文档为 User 对象 
                    var user = new User(doc);
                    // e.g:user:User { name: '123', password: 'ICy5YqxZB1uWSwcVLSNLcA==' }
                    // mongodb.close();
                    callback(err, user);
                } else {
                    // mongodb.close();
                    callback(err, null);
                }
            });
        });
    });
};

// // 儲存使用者瀏覽新聞
// User.saveNews = function saveNews(username, viewNewsURL, callback) {
//     mongodb.open(function (err, db) {
//         if (err) {
//             return callback(err);
//         }
//         // 读取 users 集合 
//         db.collection('users', function (err, collection) {
//             if (err) {
//                 mongodb.close();
//                 return callback(err);
//             }
//             collection.update({
//                 "name": username
//             }, {

//                     $push: {
//                         "viewNews": viewNewsURL
//                     },


//                 }, {
//                     safe: true
//                 })
//             // console.log(viewNews)
//             mongodb.close();
//             // callback(err, null);
//             // 頻繁的瀏覽新聞，造成請求阻塞，每次請求結束完全關閉Node.js
//             // process.exit(0);
//         });

//     });
// };


// 使用者瀏覽紀錄
User.user_viewNews = function user_viewNews(username, callback) {
    // 存入 Mongodb 的文档
    // console.log(username)
    // console.log(viewNews["url"])
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // var user = new User(doc);
                    // console.log(doc)
                    // console.log(doc.viewNews.length)
                    // 使用者沒有瀏覽過新聞
                    if (doc.viewNews.length == 0) {
                        callback(err, null);

                    } else {
                        // 使用者有瀏覽過新聞
                        callback(err, doc.viewNews);
                    }
                } else {
                    callback(err, null);
                }
            });
        });

    });
};

// 使用者瀏覽紀錄，檢查使用者瀏覽重複的URL記錄
User.check_viewNews = function check_viewNews(username, url, callback) {
    // 存入 Mongodb 的文档
    // console.log(url)
    // console.log(viewNews["url"])
    let is_find = 'no';
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                // console.log(doc)
                if (doc) {
                    // var user = new User(doc);
                    // console.log(doc)
                    // console.log(doc.viewNews.length)
                    // 使用者沒有瀏覽過新聞

                    // 使用者有瀏覽過新聞
                    for (i = 0; i < doc.viewNews.length; i++) {
                        if (url == doc.viewNews[i]) {
                            is_find = 'yes'
                        }
                    }
                    callback(err, is_find);
                } else {
                    callback(err, null);
                }
            });
        });

    });
};

// 記錄瀏覽記錄前n筆資料
User.check_viewNews_limit = async function check_viewNews_limit(username, callback) {
    // do something
    const db = await MongoClient.connect(connectionString + settings.db);
    // if (err) {
    //     throw err;
    // }
    // 读取 users 集合 
    const limit = 5;//限制數量
    const MyCollection = db.collection('users');
    const docs = await MyCollection.findOne({
        name: username
    });
    const end = docs.viewNews.length
    if (docs.viewNews.length > limit) {
        // 取出要pull的新聞，其餘刪除
        pull_news = docs.viewNews.slice(0, end - limit)
        for (i = 0; i < pull_news.length; i++) {
            MyCollection.update({
                "name": username
            }, {

                    $pull: {
                        "viewNews": pull_news[i]
                    },


                }, {
                    safe: true
                })
        }
        db.close();
        // pop_news = docs.today_pop_news.slice(from, end)
        // pop_newsLen = docs.today_pop_news.length
    }
    else {
        return null
    }
    // rec_news = doc.content_based.slice(from, end)
    // const end = (from * 1) + 40

    return null
    // return ({ pop_news, pop_newsLen })



}




// 使用者歷史相關新聞推薦
User.user_his_rec = function user_his_rec(username, from, callback) {
    // 存入 Mongodb 的文档
    // console.log(username)
    // console.log(viewNews["url"])
    // console.log(from)
    const end = (from * 1) + 40
    // console.log(from, end)
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // var user = new User(doc);
                    // console.log(doc)
                    // console.log(doc.viewNews.length)
                    // 使用者沒有瀏覽過新聞
                    if (doc.content_based.length == 0) {
                        callback(err, null);

                    } else {
                        // 使用者有瀏覽過新聞
                        rec_news = doc.content_based.slice(from, end)
                        rec_newsLen = doc.content_based.length

                        // callback(err, rec_news, doc.content_based.length);
                        // callback(err, rec_news);
                        callback(err, rec_news, rec_newsLen);
                    }
                } else {
                    callback(err, null);
                }
            });
        });

    });
};

User.user_cf_rec = function user_cf_rec(username, from, callback) {
    // 存入 Mongodb 的文档
    // console.log(username)
    // console.log(viewNews["url"])
    // console.log(from)
    const end = (from * 1) + 40
    // console.log(from, end)
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // var user = new User(doc);
                    // console.log(doc)
                    // console.log(doc.viewNews.length)
                    // 使用者沒有瀏覽過新聞
                    if (doc.user_based.length == 0) {
                        callback(err, null);

                    } else {
                        // 使用者有瀏覽過新聞
                        rec_news = doc.user_based.slice(from, end)
                        rec_newsLen = doc.user_based.length

                        // callback(err, rec_news, doc.content_based.length);
                        // callback(err, rec_news);
                        callback(err, rec_news, rec_newsLen);
                    }
                } else {
                    callback(err, null);
                }
            });
        });

    });
};

// 使用者歷史相關新聞推薦
User.user_cat_rec = function user_cat_rec(username,callback) {
    // 存入 Mongodb 的文档
    // console.log(username)
    // console.log(viewNews["url"])
    // console.log(from)
    // console.log(from, end)
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // var user = new User(doc);
                    // console.log(doc)
                    // console.log(doc.viewNews.length)
                    // 使用者沒有瀏覽過新聞
                    if (doc.cat_based.length == 0) {
                        callback(err, null);

                    } else {
                        // 使用者有瀏覽過新聞
                        cat_based = doc.cat_based

                 
                        callback(err, cat_based);
                    }
                } else {
                    callback(err, null);
                }
            });
        });

    });
};

User.user_rec_all = function user_rec_all(username, from, callback) {
    // 存入 Mongodb 的文档
    // console.log(username)
    // console.log(viewNews["url"])
    // console.log(from)
    const end = (from * 1) + 40
    // console.log(from, end)
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // var user = new User(doc);
                    // console.log(doc)
                    // console.log(doc.viewNews.length)
                    // 使用者沒有瀏覽過新聞
                    if (doc.user_rec.length == 0) {
                        callback(err, null);

                    } else {
                        // 使用者有瀏覽過新聞
                        rec_news = doc.user_rec.slice(from, end)
                        rec_newsLen = doc.user_rec.length

                        // callback(err, rec_news, doc.content_based.length);
                        // callback(err, rec_news);
                        callback(err, rec_news, rec_newsLen);
                    }
                } else {
                    callback(err, null);
                }
            });
        });

    });
};
// 使用者推薦新聞
User.rec_News = function rec_News(username, from, callback) {
    // 存入 Mongodb 的文档
    // console.log(username)
    // console.log(viewNews["url"])
    // console.log(from)
    const end = (from * 1) + 40
    // console.log(from, end)
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // var user = new User(doc);
                    // console.log(doc)
                    // console.log(doc.viewNews.length)
                    // 使用者沒有瀏覽過新聞
                    if (doc.content_based.length == 0) {
                        callback(err, null);

                    } else {
                        // 使用者有瀏覽過新聞
                        rec_news = doc.content_based.slice(from, end)
                        rec_newsLen = doc.content_based.length

                        // callback(err, rec_news, doc.content_based.length);
                        // callback(err, rec_news);
                        callback(err, rec_news, rec_newsLen);
                    }
                } else {
                    callback(err, null);
                }
            });
        });

    });
};

// 使用者推薦類別新聞
User.rec_News_all = function rec_News_all(username, callback) {

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                if (doc) {
                    if (doc.content_based.length == 0) {
                        callback(err, null);

                    } else {

                        callback(err, doc.content_based);
                    }
                } else {
                    callback(err, null);
                }
            });
        });

    });
};


// 儲存使用者評分新聞
User.saveNews = function saveNews(username, viewNewsURL, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({
                "name": username
            }, {

                    $push: {
                        "viewNews": viewNewsURL
                    },


                }, {
                    safe: true
                })
            // console.log(viewNews)
            mongodb.close();
            // callback(err, null);
            // 頻繁的瀏覽新聞，造成請求阻塞，每次請求結束完全關閉Node.js
            // process.exit(0);
        });

    });
};




// 讀取使用者該篇新聞評分紀錄
User.fetch_rating = function fetch_rating(username, url, callback) {
    // 存入 Mongodb 的文档
    // console.log(url)
    // console.log(viewNews["url"])
    let ratingNews = null;
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                // console.log(doc)
                if (doc) {

                    // 使用者有評分過新聞
                    // for (i = 0; i < doc.rating.length; i++) {
                    //     if (url == doc.rating[i].url) {
                    //         ratingNews = doc.rating[i];
                    //         break;
                    //     }
                    // }
                    // 使用者有評分過新聞
                    for (i = 0; i < doc.rating.length; i++) {
                        if (url == doc.rating[i]["url"]) {
                            ratingNews = doc.rating[i];
                            break;
                        }

                    }
                    callback(err, ratingNews);
                } else {
                    callback(err, null);
                }
            });
        });

    });
};


// 檢查使用者是否評分過該篇新聞
User.check_viewNews_rating = function check_viewNews_rating(username, url, callback) {
    // 存入 Mongodb 的文档
    // console.log(url)
    // console.log(viewNews["url"])
    let is_find = 'no';
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合 
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: username
            }, function (err, doc) {
                mongodb.close();
                // console.log(doc)
                if (doc) {
                    // var user = new User(doc);
                    // console.log(doc.rating)
                    // console.log(doc.rating.length)
                    // console.log(doc[url])
                    // console.log(doc.rating[0].url)
                    // console.log(doc.rating[0].value)
                    // for (url in doc.rating) {
                    //     console.log(doc.rating[url]);
                    // }
                    // 使用者有評分過新聞
                    //key                 = keys,  left of the ":"
                    //driversCounter[key] = value, right of the ":"
                    // const urlList = Object.keys(doc.rating);
                    // console.log(urlList);
                    for (i = 0; i < doc.rating.length; i++) {
                        for (doc_url in doc.rating[i]) {
                            if (url == doc_url) {
                                is_find = 'yes'
                            }
                        }
                        if (is_find == 'yes') {
                            break;
                        }

                    }
                    callback(err, is_find);
                } else {
                    callback(err, null);
                }
            });
        });

    });
};



// 更新評分紀錄
User.update_RatingNews = async function update_RatingNews(username, stars, callback) {
    // do something
    url = Object.keys(stars)[0];
    const db = await MongoClient.connect(connectionString + settings.db);

    const MyCollection = db.collection('users');
    const docs = await MyCollection.findOne({
        name: username
    });
    if (docs) {
        // 取出要pull的新聞，其餘刪除
        MyCollection.update({
            "name": username
        }, {

                $pull: {
                    "rating": url
                },


            }, {
                safe: true
            })
        db.close();

    }
    else {
        return null
    }



}






var express = require('express');
var router = express.Router();
// Execute A Unix Command With Node.js
var sys = require('sys')
var exec = require('child_process').exec;
//md5加密中間件
const TodaySearch_term_All = require('../server/TodaySearch_term_All')
const TodaySearch_term_Cat = require('../server/TodaySearch_term_Cat')
const TodaySearch = require('../server/TodaySearch')
// const viewNews = require('../server/viewNews')
const fech_NewsUrl = require('../server/fech_NewsUrl')
const fech_News_CatUrl = require('../server/fech_News_CatUrl')
// const user_recNews = require('../server/user_recNews')
const Search_cat = require('../server/Search_cat')
var crypto = require('crypto');
var User = require('../models/user.js');
var day_popkeywords = require('../models/day_popkeywords.js');
var news_group = require('../models/news_group.js');
var date_popNews = require('../models/date_popNews.js');
var pop_News = require('../models/pop_News.js');
var update_RatingNews = require('../models/update_RatingNews.js');
var save_RatingNews = require('../models/save_RatingNews.js');
var check_viewNews_rating = require('../models/check_viewNews_rating.js');
var delete_RatingNews = require('../models/delete_RatingNews.js');
var SearchKeywords = require('../server/SearchKeywords.js');
var random_news=require('../models/random_news.js');

// var Post = require('../models/post.js');

//主頁路由
router.get('/', function (req, res, next) {

    res.render('index', {
        title: '首頁',
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

//註冊頁路由
router.get("/reg", checkNotLogin);
router.get('/reg', function (req, res, next) {
    res.render('reg', {
        title: '使用者註冊'
    });
});

router.post("/reg", checkNotLogin);
router.post('/reg', function (req, res, next) {
    /*
    e.g:req.body
    [Object: null prototype] {
    username: 'abc123',
    password: 'abc123',
    'password-repeat': 'abc123' }
    */
    //    帳號一定要有英文跟數字組合
    // var re = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/; 
    
    // if (!re.test(req.body['username'])||req.body['username'].length<8 || req.body['username'].length>16) {
    //     // console.log(req.body['username'].length);
   
    //     req.flash('error', '帳號長度須為8-16，並且為數英文、數字混合');
        
    //     return res.redirect('/reg');
    // }

    // 檢查輸入的是否是數字或英文字
    // if (!re.test(req.body['password'])||req.body['password'].length<8 || req.body['password'].length>16) {
    //     // console.log(req.body['password'].length);

    //     req.flash('error', '密碼長度須為8-16，並且為數英文、數字混合');
        
    //     return res.redirect('/reg');
    // }

    if (req.body['password-repeat'] != req.body['password']) {
        console.log("no repeat")
        req.flash('error', '兩次輸入的密碼不一致');
        return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    //  User  是用户对象
    // req.body  就是  POST  请求信息解析过后的对象，例如我们要访问用户传递的 password  域的值，只需访问  req.body['password']  即可。 

    var newUser = new User({
        name: req.body.username,
        password: password,
        // viewNews: []
    });

    //檢查用戶是否已經存在
    // User.get   的功能是通过用户名获取已知用户，在这里我们判断用户名是否已经存在。 User.save  可以将用户对象的修改写入数据库。
    User.get(newUser.name, function (err, user) {
        if (user) {
            err = '用戶已經存在!';
        }
        if (err) {
            // req.flash   是  Express 提供的一个工具，通过它保存的变量只会在用户当前和下一次的请求中被访问，之后会被清除，通过它我们可以很方便地实现页面的通知和错误信息显示功能。
            req.flash('error', err);
            // res.redirect  是重定向功能，通过它会向用户返回一个 303 See Other 状态，通知浏览器转向相应页面。 
            return res.redirect('/reg');
        }
        newUser.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            // req.session.user = newUser  向会话对象写入了当前用户的信息，之後会通过它判断用户是否已经登录。登入和登出是透過req.session.user变量的标记
            // e.g:newUser:User { name: '213', password: 'l51HKoSAS59ke8GFqHeotQ==' }
            req.session.user = newUser;

            req.flash('success', '註冊成功！');
            res.redirect('/');

        });
    });

});

//登錄頁路由
router.get("/login", checkNotLogin);
router.get('/login', function (req, res, next) {
    res.render("login", {
        title: "使用者登入",
    });

});

router.post("/login", checkNotLogin);
router.post('/login', function (req, res, next) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, function (err, user) {
        if (!user) {
            req.flash('error', '使用者不存在');
            return res.redirect('/login');
        }
        if (user.password != password) {
            req.flash('error', '使用者密碼錯誤');
            return res.redirect('/login');
        }
        req.session.user = user;
        // console.log(req.session.user)
        req.flash('success', '登入成功');
        res.redirect('/');
    });
});


//登出頁路由
router.get("/logout", checkLogin);
router.get('/logout', function (req, res, next) {
    // console.log(req.session)
    // console.log(req.session.user)
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
});





function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}

// 用戶資訊
router.get('/Info', function (req, res, next) {
    res.render('info', {
        title: '使用者資訊'
    });
});

// 用戶資訊
router.get('/rec', function (req, res, next) {
    res.render('rec', {
        title: '推薦新聞'
    });
});


// 讀取使用者推薦新聞URL，並傳回，之後透過ES搜尋URL獲取新聞
router.get('/rec_News', async function (req, res, next) {
    // const offset = req.query.offset //獲得query的offset欄位內容
    // const user = req.session.user.name
    const news = []
    // const result = await fech_NewsUrl.queryTerm(user) //搜尋
    // console.log('123')
    // 沒有登入，或是使用者沒有瀏覽過新聞，回傳null
    // console.log(req.session.user)
    if (req.session.user != null) {
        const user = req.session.user.name
        const from = req.query.from
        User.rec_News(user, from, function (err, rec_news, rec_newsLen) {
            // console.log(rec_news)
            // console.log(rec_newsLen)
            // res.send(rec_news, all_news_length); //結果傳回前端
            res.send({ rec_news, rec_newsLen })
            // res.send(rec_news, rec_newsLen); //結果傳回前端

        });
        // res.send(viewNews); //結果傳回前端
        // 沒有登入會員    
    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});

// 讀取使用者推薦所有新聞URL，並傳回，之後透過ES搜尋URL獲取新聞
router.get('/rec_News_all', async function (req, res, next) {
    // const offset = req.query.offset //獲得query的offset欄位內容
    // const user = req.session.user.name
    const news = []
    // const result = await fech_NewsUrl.queryTerm(user) //搜尋
    // console.log('123')
    // 沒有登入，或是使用者沒有瀏覽過新聞，回傳null
    if (req.session.user != null) {
        const user = req.session.user.name
        User.rec_News_all(user, function (err, rec_news) {
            res.send(rec_news)

        });
        // res.send(viewNews); //結果傳回前端
        // 沒有登入會員    
    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});


// ES搜尋使用者推薦新聞(限定類別)
// router.post('/user_recNews_cat', async function (req, res, next) {
//     // const offset = req.query.offset //獲得query的offset欄位內容
//     const recNews = req.body.user_recNews_cat
//     const newsList = []
//     for (i = 0; i < recNews.length; i++) {
//         let newsItem = await fech_News_CatUrl.queryTerm(recNews[i]) //搜尋
//         newsList.push(newsItem)
//     }
//     res.send(newsList); //結果傳回前端
// });

// 讀取使用者瀏覽紀錄URL，並傳回，之後透過ES搜尋URL獲取新聞
router.get('/Read_viewNews', async function (req, res, next) {
    // const offset = req.query.offset //獲得query的offset欄位內容
    // const user = req.session.user.name
    const news = []
    // const result = await user_viewNews.queryTerm(user) //搜尋
    // console.log('123')
    // 沒有登入，或是使用者沒有瀏覽過新聞，回傳null
    if (req.session.user != null) {
        const user = req.session.user.name
        User.user_viewNews(user, function (err, viewNews) {
            // console.log(viewNews)
            res.send(viewNews); //結果傳回前端

        });
        // res.send(viewNews); //結果傳回前端
        // 沒有登入會員    
    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});

// 檢查使用者瀏覽重複的URL記錄
router.post('/check_viewNews', async function (req, res, next) {
    const url = req.body.url
    // const user = req.session.user.name
    if (req.session.user != null) {
        // console.log(url)
        const user = req.session.user.name
        User.check_viewNews(user, url, function (err, is_find) {
            // console.log(is_find)
            res.send(is_find); //結果傳回前端
        });


    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});


// ES搜尋使用者瀏覽紀錄
router.post('/user_viewNews', async function (req, res, next) {
    // const offset = req.query.offset //獲得query的offset欄位內容
    // const Read_viewNews = req.query.Read_viewNews
    // const id = req.query.id
    const Read_viewNews = req.body.Read_viewNews
    // console.log(Read_viewNews)
    const newsList = []
    for (i = 0; i < Read_viewNews.length; i++) {
        let newsItem = await fech_NewsUrl.queryTerm(Read_viewNews[i]) //搜尋
        newsList.push(newsItem)
    }
    res.send(newsList); //結果傳回前端

});
// 首頁，今日新聞
router.get('/TodaySearch', async function (req, res, next) {
    const offset = req.query.offset //獲得query的offset欄位內容
    const result = await TodaySearch.queryTerm(offset) //搜尋
    res.send(result); //結果傳回前端
});

// 首頁，今日新聞搜尋字詞(所有類別)
router.get('/TodaySearch_term_All', async function (req, res, next) {
    // console.log(req.session.user)
    const offset = req.query.offset //獲得query的offset欄位內容
    const term = req.query.term
    const result = await TodaySearch_term_All.queryTerm(term, offset) //搜尋
    // console.log(result)
    res.send(result); //結果傳回前端
});

// 首頁，今日新聞搜尋字詞(特定類別)
router.get('/TodaySearch_term_Cat', async function (req, res, next) {
    // console.log(req.session.user)
    const offset = req.query.offset //獲得query的offset欄位內容
    const newsCat = req.query.newsCat
    const term = req.query.term
    const result = await TodaySearch_term_Cat.queryTerm(term, newsCat, offset) //搜尋
    // console.log(term)
    res.send(result); //結果傳回前端
});


//存放使用者瀏覽過的新聞，只存新聞的URL
router.post("/viewNews", async function (req, res, next) {
    // console.log(req.session.user)
    // console.log(req.body.viewNews)
    const viewNewsURL = req.body.viewNewsURL //獲得query的offset欄位內容
    // console.log(viewNewsURL)
    // 如果有登入，儲存瀏覽過的新聞
    if (req.session.user != null) {
        User.saveNews(req.session.user.name, viewNewsURL, function (err, user) {

        });
        res.send(null);
    }

});

//存放使用者瀏覽過的新聞
// router.get('/viewNews', async function(req, res, next) {
//     const url = req.query.url //獲得query的offset欄位內容
//         // console.log(url)
//     const result = await viewNews.queryTerm(url) //搜尋
//     console.log(result)
//     res.send(result); //結果傳回前端
// });

// 推薦某類別新聞
router.post('/cat_recNews', async function (req, res, next) {
    const rec_url = req.body.rec_url;
    const cat = req.body.cat;
    let rec_cat_total = 0
    const from = req.body.from;
    const end = (from * 1) + 40
    // console.log(from, end, cat)
    let newsList = []
    for (i = 0; i < rec_url.length; i++) {
        // 該類別的url
        let newsItem = await fech_News_CatUrl.queryTerm(rec_url[i], cat) //搜尋

        if (newsItem['hits']['total'] == 1) {
            newsList.push(newsItem)
            rec_cat_total += 1
        }
        // console.log(newsItem)
        // newsList.push(newsItem)
    }
    newsList = newsList.slice(from, end)
    // console.log(newsList.length)
    // // for (i = 0; i < newsList.length; i++) {

    // // }
    // // const result = await Search_cat.queryTerm(term, offset) //搜尋
    res.send({ newsList, rec_cat_total }); //結果傳回前端
});


// 搜尋當日的某類別新聞
router.get('/Search_cat', async function (req, res, next) {
    const term = req.query.term //獲得query的offset欄位內容
    const offset = req.query.offset
    // console.log(term)
    const result = await Search_cat.queryTerm(term, offset) //搜尋
    // console.log(result)
    res.send(result); //結果傳回前端
});

// 查詢該類別的熱門關鍵字
router.get("/day_popkeywords", async function (req, res, next) {

    // console.log(req.body.viewNews)
    const newsCat = req.query.newsCat //獲得query的offset欄位內容
    // const News = new Newsmodel();
    const popkeywords = await day_popkeywords(newsCat);
    res.send(popkeywords);
    // console.log(popkeywords)
    // console.log()
    // User.saveNews(req.session.user.name, viewNewsURL, function (err, user) {
    //     // console.log('response')
    //     res.send(null);

    // });

});

// 使用關鍵字查詢當日的某類別新聞
router.get('/SearchKeywords', async function (req, res, next) {
    const newsCat = req.query.newsCat
    const keyowrds = req.query.keyowrds
    const offset = req.query.offset
    const result = await SearchKeywords.queryTerm(newsCat, keyowrds, offset)
    // console.log(newsCat, keyowrds, offset)
    // console.log(result)
    res.send(result); //結果傳回前端
});


// 查詢新聞的group
router.post("/news_group", async function (req, res, next) {

    const url = req.body.url
    const group_url = await news_group(url);
    res.send(group_url);
});


// ES搜尋group新聞
router.post('/group_search', async function (req, res, next) {
    // const offset = req.query.offset //獲得query的offset欄位內容
    // const Read_viewNews = req.query.Read_viewNews
    // const id = req.query.id
    const url = req.body.url;
    // console.log(url)
    // console.log(Read_viewNews)
    const newsList = []
    for (i = 0; i < url.length; i++) {
        let newsItem = await fech_NewsUrl.queryTerm(url[i]) //搜尋
        newsList.push(newsItem)
    }
    res.send(newsList); //結果傳回前端

});

// 查詢當日熱門新聞
router.get("/date_popNews", async function (req, res, next) {
    const from = req.query.from
    // console.log(from);
    const pop = await date_popNews(from);
    // console.log(pop)
    // console.log(pop)
    // console.log(pop_len)
    res.send(pop);
});

// 查詢近期熱門新聞
router.get("/pop_News", async function (req, res, next) {
    const from = req.query.from
    console.log(from);
    const pop = await pop_News(from);

    res.send(pop);
});

// ES搜尋當日熱門新聞
router.post('/pop_search', async function (req, res, next) {
    const pop_url = req.body.url
    const newsList = []
    for (i = 0; i < pop_url.length; i++) {
        let newsItem = await fech_NewsUrl.queryTerm(pop_url[i]) //搜尋
        newsList.push(newsItem)
    }
    res.send(newsList); //結果傳回前端
});

// 讀取使用者相關新聞推薦，並傳回，之後透過ES搜尋URL獲取新聞
router.get('/user_his_rec', async function (req, res, next) {
    const news = []
    if (req.session.user != null) {
        const user = req.session.user.name
        const from = req.query.from
        User.user_his_rec(user, from, function (err, rec_news, rec_newsLen) {
            // console.log(rec_news)
            // console.log(rec_newsLen)
            // res.send(rec_news, all_news_length); //結果傳回前端
            res.send({ rec_news, rec_newsLen })
            // res.send(rec_news, rec_newsLen); //結果傳回前端

        });
        // res.send(viewNews); //結果傳回前端
        // 沒有登入會員    
    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});



router.get('/user_cf_rec', async function (req, res, next) {
    const news = []
    if (req.session.user != null) {
        const user = req.session.user.name
        const from = req.query.from
        User.user_cf_rec(user, from, function (err, rec_news, rec_newsLen) {
            // console.log(rec_news)
            // console.log(rec_newsLen)
            // res.send(rec_news, all_news_length); //結果傳回前端
            res.send({ rec_news, rec_newsLen })
            // res.send(rec_news, rec_newsLen); //結果傳回前端

        });
        // res.send(viewNews); //結果傳回前端
        // 沒有登入會員    
    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});

router.get('/user_rec_all', async function (req, res, next) {
    const news = []
    if (req.session.user != null) {
        const user = req.session.user.name
        const from = req.query.from
        User.user_rec_all(user, from, function (err, rec_news, rec_newsLen) {
            // console.log(rec_news)
            // console.log(rec_newsLen)
            // res.send(rec_news, all_news_length); //結果傳回前端
            res.send({ rec_news, rec_newsLen })
            // res.send(rec_news, rec_newsLen); //結果傳回前端

        });
        // res.send(viewNews); //結果傳回前端
        // 沒有登入會員    
    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});


// ES搜尋使用者推薦新聞
router.post('/user_his_rec_search', async function (req, res, next) {
    // const offset = req.query.offset //獲得query的offset欄位內容
    const recNews = req.body.user_recNews
    const newsList = []
    // recNews.length==null會error
    try {
        for (i = 0; i < recNews.length; i++) {
            let newsItem = await fech_NewsUrl.queryTerm(recNews[i]) //搜尋
            newsList.push(newsItem)
        }
        res.send(newsList); //結果傳回前端
    }
    catch{
        res.send(null);
    }
});

// 記錄使用者瀏覽記錄前n筆新聞，其餘刪除
router.get('/check_viewNews_limit', async function (req, res, next) {

    if (req.session.user != null) {
        const user = req.session.user.name
        User.check_viewNews_limit(user, function (err, viewNews) {
            // console.log(rec_news)
            // console.log(rec_newsLen)
            // res.send(rec_news, all_news_length); //結果傳回前端
            // res.send({ rec_news, rec_newsLen })
            // res.send(rec_news, rec_newsLen); //結果傳回前端
            // console.log(viewNews)
            // res.send(null);

        });
        res.send(null);
        // res.send(viewNews); //結果傳回前端
        // 沒有登入會員    
    } else {
        res.send(null);
    }

});


//存放使用者評分過的新聞，存新聞的URL,平均分數,各項目評分
router.post("/save_RatingNews", async function (req, res, next) {
    // console.log(req.session.user)
    // console.log(req.body.viewNews)
    const url = req.body.url;
    const stars_avg = req.body.stars_avg;
    const stars_1 = req.body.stars_1;
    const stars_2 = req.body.stars_2;
    const stars_3 = req.body.stars_3;
    // let stars = {};
    let stars = { [url]: [stars_avg, stars_1, stars_2, stars_3] };

    // stars = JSON.stringify(stars);
    // stars_len = stars.length;
    // console.log(stars)
    // console.log(stars.substring(1, stars_len - 1));
    // const stars = { "url": url, "rating": [stars_avg, stars_1, stars_2, stars_3] };
    // console.log(stars)
    // console.log(viewNewsURL)
    // 如果有登入，儲存瀏覽過的新聞
    if (req.session.user != null) {
        const item = await save_RatingNews(req.session.user.name, stars);
        res.send(null);
    }

});

//更新使用者評分過的新聞，存新聞的URL,平均分數,各項目評分
router.post("/update_RatingNews", async function (req, res, next) {
    // console.log(req.session.user)
    // console.log(req.body.viewNews)
    const url = req.body.url;
    const stars_avg = req.body.stars_avg;
    const stars_1 = req.body.stars_1;
    const stars_2 = req.body.stars_2;
    const stars_3 = req.body.stars_3;
    // let stars = {};
    let stars = { [url]: [stars_avg, stars_1, stars_2, stars_3] };
    // const stars = { "url": url, "rating": [stars_avg, stars_1, stars_2, stars_3] };
    // console.log(stars)
    // console.log(viewNewsURL)
    // 如果有登入，儲存瀏覽過的新聞
    if (req.session.user != null) {
        const user = req.session.user.name
        const item = await update_RatingNews(req.session.user.name, stars);
        // User.update_RatingNews(user, stars, function (err, ratingNews) {
        //     // console.log(is_find)
        //     res.send(ratingNews); //結果傳回前端
        // });
        res.send(null); //結果傳回前端

    }

});

// 讀取使用者該篇新聞的評分紀錄
router.post('/fetch_rating', async function (req, res, next) {
    const url = req.body.url
    // const user = req.session.user.name
    if (req.session.user != null) {
        // console.log(url)
        const user = req.session.user.name
        User.fetch_rating(user, url, function (err, ratingNews) {
            // console.log(is_find)
            res.send(ratingNews); //結果傳回前端
        });


    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});



// 刪除使用者評分過的新聞
router.post('/delete_RatingNews', async function (req, res, next) {
    const url = req.body.url
    // const user = req.session.user.name
    if (req.session.user != null) {
        // console.log(url)
        const user = req.session.user.name
        const is_find = await delete_RatingNews(req.session.user.name, url);
        res.send(is_find);

    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});

// 檢查使用者是否評分過該篇新聞
router.post('/check_viewNews_rating', async function (req, res, next) {
    const url = req.body.url
    // const user = req.session.user.name
    if (req.session.user != null) {
        // console.log(url)
        const user = req.session.user.name
        const is_find = await check_viewNews_rating(req.session.user.name, url);
        res.send(is_find);

    } else {
        res.send(null);
    }
    // // const result = await TodaySearch.queryTerm(offset) //搜尋
    // // res.send(result); //結果傳回前端
});



//user history rec
router.post("/his_rec", async function (req, res, next) {
    // console.log(req.session.user)
    // console.log(req.body.viewNews)
    const viewNewsURL = req.body.viewNewsURL //獲得query的offset欄位內容
    // console.log(viewNewsURL)
    // 如果有登入，儲存瀏覽過的新聞
    // console.log(req.session.user.name)
    // console.log(viewNewsURL)
    if (req.session.user != null) {
        // executes `pwd`
        const parameter = "bash user_his_rec.sh -i " + viewNewsURL + " -u " + req.session.user.name
        // console.log(temp)
        // const parameter="bash test.sh"
        child = exec(parameter, function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            // sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
        // User.saveNews(req.session.user.name, viewNewsURL, function (err, user) {

        // });
        // res.send(null);
    }
    res.send(null);

});
//user cf rec
router.post("/cf_rec", async function (req, res, next) {
    // console.log(req.session.user)
    // console.log(req.body.viewNews)
    // const viewNewsURL = req.body.viewNewsURL //獲得query的offset欄位內容
    // console.log(viewNewsURL)
    // 如果有登入，儲存瀏覽過的新聞
    // console.log(req.session.user.name)
    if (req.session.user != null) {
        // executes `pwd`
        const parameter = "bash user_cf_rec.sh -u " + req.session.user.name
        // console.log(temp)
        // const parameter="bash test.sh"
        child = exec(parameter, function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            // sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
        // User.saveNews(req.session.user.name, viewNewsURL, function (err, user) {

        // });
        // res.send(null);
    }
    res.send(null);

});
//user ec
router.post("/user_rec", async function (req, res, next) {
    // console.log(req.session.user)
    // console.log(req.body.viewNews)
    const viewNewsURL = req.body.viewNewsURL //獲得query的offset欄位內容
    // console.log(viewNewsURL)
    // 如果有登入，儲存瀏覽過的新聞
    // console.log(req.session.user.name)
    if (req.session.user != null) {
        // executes `pwd`
        const parameter = "bash user_rec.sh -u " + req.session.user.name
        // console.log(temp)
        // const parameter="bash test.sh"
        child = exec(parameter, function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            // sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
        // User.saveNews(req.session.user.name, viewNewsURL, function (err, user) {

        // });
        // res.send(null);
    }
    res.send(null);

});
// //random
// router.post("/random", async function (req, res, next) {
//     // console.log(req.session.user)
//     // console.log(req.body.viewNews)
//     // console.log(viewNewsURL)
//     // 如果有登入，儲存瀏覽過的新聞
//     // console.log(req.session.user.name)
//     if (req.session.user != null) {
//         // executes `pwd`
//         const parameter = "bash random_news.sh"
//         // console.log(temp)
//         // const parameter="bash test.sh"
//         child = exec(parameter, function (error, stdout, stderr) {
//             sys.print('stdout: ' + stdout);
//             // sys.print('stderr: ' + stderr);
//             if (error !== null) {
//                 console.log('exec error: ' + error);
//             }
//         });
//         // User.saveNews(req.session.user.name, viewNewsURL, function (err, user) {

//         // });
//         // res.send(null);
//     }
//     res.send(null);

// });

router.get("/randomNews", async function (req, res, next) {
    if (req.session.user != null) {
        const user = req.session.user.name
        User.user_cat_rec(user, function (err, cat_based) {
            // console.log(rec_news)
            // console.log(rec_newsLen)
            // res.send(rec_news, all_news_length); //結果傳回前端
            res.send(cat_based)
            // res.send(rec_news, rec_newsLen); //結果傳回前端

        });
        // res.send(viewNews); //結果傳回前端
        // 沒有登入會員    
    } else {
        res.send(null);
    }
    // res.send(null);

});


router.post('/random_search', async function (req, res, next) {
    // const offset = req.query.offset //獲得query的offset欄位內容
    const random_news = req.body.random_news
    const newsList = []
    // recNews.length==null會error
    try {
        for (i = 0; i < random_news.length; i++) {
            let newsItem = await fech_NewsUrl.queryTerm(random_news[i]) //搜尋
            newsList.push(newsItem)
        }
        res.send(newsList); //結果傳回前端
    }
    catch{
        res.send(null);
    }
});

// cat based
router.post("/cat_rec", async function (req, res, next) {
    // console.log(req.session.user)
    // console.log(req.body.viewNews)
    const cat = req.body.cat //獲得query的offset欄位內容
    // console.log(viewNewsURL)
    // console.log(req.session.user.name)
    if (req.session.user != null) {
        // executes `pwd`
        const parameter = "bash user_cat_rec.sh -c " + cat + " -u " + req.session.user.name
        // console.log(temp)
        // const parameter="bash test.sh"
        child = exec(parameter, function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            // sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
        // User.saveNews(req.session.user.name, viewNewsURL, function (err, user) {

        // });
        // res.send(null);
    }
    res.send(null);

});
module.exports = router;


var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials'); //layout.ejs依赖
// session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
//flash 通过它保存的变量只会在用户当前和下一次的请求中被访问，之后会被清除
//通过它可以很方便地实现页面的通知和错误信息显示功能
var flash = require('connect-flash');

// 載入路由檔案
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express(); //建立一個express物件
var cors = require('cors'); // 設定 CORS
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.use(cors()); //使用CORS，cors 的預設為全開放：
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));//serve-favicon
// Middleware 的 Log System，用來紀錄 HTTP 的請求。
app.use(logger('dev')); //打印到控制枱  
/*
现在只要是在网上传播的HTTP信息，都带有Content-Type头，以表明信息类型。

body-parser是非常常用的一个express中间件，作用是对post请求的请求体进行解析。使用非常简单，以下两行代码已经覆盖了大部分的使用场景。
Content-Type：请求报文主体的类型、编码。常见的类型有text/plain、application/json、application/x-www-form-urlencoded。常见的编码有utf8、gbk等。
body-parser:
处理不同类型的请求体：比如text、json、urlencoded等，对应的报文主体的格式不同。
*/
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //
app.use(cookieParser());

/*
在 express 裡面有一個 function 叫做 express.static()這個是一個 middleware，最常被用在要讀取一些靜態檔案上面
將含有靜態資產的目錄名稱傳遞給 express.static 中介軟體函數
以這個寫法來說 app.use(express.static(__dirname + './public'))
是指向 public 這個資校夾裡面，假設裡面有一個檔案叫做 index.html 的話，並且伺服器的 port 是 8080
那麼在網址列輸入 http://localhost:8080/index.html 這樣就可以讀到這個檔案了
靜態檔案 like .js, .json, .xml, html....
*/
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

/*
会话支持
Note: session data 並不會儲存在 cookie 裡，cookie 存的是 sessionID.
Note: session data 儲存在 server端，

接著，我們看看有哪些重要的option：
secret(必要選項)：用來簽章 sessionID 的cookie, 可以是一secret字串或是多個secret組成的一個陣列。如果是陣列, 只有第一個元素會被 簽到 sessionID cookie裡。而在驗證請求中的簽名時，才會考慮所有元素。
store：session在server 端的存放方式,預設 MemoryStore，這邊是在mongoDB 存 session

设置它的  store  参数为  MongoStore  实例，把会话信息存储到数据库中。
通过  req.session  获取当前用户的会话对象。
*/
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db
    })
}));

// 本例顯示沒有裝載路徑的中介軟體函數。每當應用程式收到要求時，就會執行此函數。
app.use(function(req, res, next) {
    // console.log("app.usr local");
    // req.session.user : { name: 'test', password: 'CY9rzUYh03PK3k6DJie09g==' }
    /*
    locals对象用于将数据传递至所渲染的模板中。
    这样在调用 res.render 的时候就不用传入这四个变量了，express 为我们自动 merge 并传入了模板，所以我们可以在模板中直接使用这四个变量。

    locals可能存在于app对象中即：app.locals；也可能存在于res对象中，即：res.locals。两者都会将该对象传递至所渲染的页面中。不同的是，app.locals会在整个生命周期中起作用；而res.locals只会有当前请求中起作用。
    */
    res.locals.user = req.session.user;
    // console.log(res.locals.user)
    // res.locals.post = req.session.post;
    // console.log(res.locals.user)
    // console.log(req.session.post)
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;
    // console.log(error)

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});
/*
Simply app.use means “Run this on ALL requests”
app.get means “Run this on a GET request, for the given URL”
*/
/*
這裡我們建立一個 Router 物件，然後設定這個物件的路由規則，最後再將這個 Router 物件的路由規則套用至應用程式中：

*/
app.use('/', routes);
// 宣告user物件是routes/user.js。當網站上有使用者瀏覽http://l27.0.0.1:3000/users，網站伺服器就會去routes/user.js檔中找對應的路由函式
app.use('/users', users);
// app.listen(3000);//serve-favicon

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // 顯示編譯噴錯訊息。err: Error: Not Found .........
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
// Express app.get('env') returns 'development' if NODE_ENV is not defined.
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        // 透過上面的next(err)把err傳進來
        // 顯示編譯噴錯訊息。err: Error: Not Found .........
        // HTTP 錯誤 500 - 內部伺服器錯誤
        // err.message : Not Found
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


module.exports = app;
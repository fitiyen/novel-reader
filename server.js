var path = require('path');
var express = require('express');
var webpack = require('webpack');
var axios = require('axios');
var cheerio = require("cheerio"); //類似 jquery 的東西
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

//使用靜態目錄。第一個參數指定 虛擬目錄(非必要)
app.use('/static', express.static(__dirname + '/build'));
//熱部署
// app.use(require('webpack-dev-middleware')(compiler,{
//     noInfo: true,
//     publicPath: config.output.publicPath,
// })); 
// app.use(require('webpack-hot-middleware')(compiler));

app.get('/novelInfo', function(req, res){
    var url = req.query.url;
    axios.get(url).then(function(resA){
        //res.data = html 的內容
        var html = resA.data;
        var $ = cheerio.load(html);
        //取標題 class=title
        var title = $(".title h2").text();
        //取楔子 id=CommentText 
        var wedge = $("#CommentText").text();
        //取目錄網址 
        var contentUrl = $(".bkcontent .imgclass .as a").attr("href");
        var jdata = {title, wedge, contentUrl};
        
        res.send(JSON.stringify(jdata));
    })
})

app.get('/novelContents', function(req, res){
    var url = req.query.url;
    axios.get(url).then(function(resA){
        //res.data = html 的內容
        var html = resA.data;
        var $ = cheerio.load(html);
        var list = [];
        //取目錄清單 #BookText ul li a
        $("#BookText ul li a").each(function (i, e) {
            var $e = $(e);
            list.push({'title': $e.text(), 'href': $e.attr("href")});
        });
        var jdata = {list};
        
        res.send(JSON.stringify(jdata));
    })
})

app.get('/chapter', function(req, res){
    var url = req.query.url;
    axios.get(url).then(function(resA){
        //res.data 是 html 的內容
        var html = resA.data;
        //关闭 cheerio 中的 .html() 方法 转换实体编码的功能（2016-01-25 add）
        //var $ = cheerio.load(html, {decodeEntities: false});
        var $ = cheerio.load(html);
        var chapter;
        //取章節內文。取得 id 為 content 下的最後一個 div
        $("#content > div:last-of-type").each(function (i, e) {
            var $e = $(e);
            chapter = $e.text();
            //chapter = $e.html();
        });
        var jdata = {chapter};
        
        res.send(JSON.stringify(jdata));
    })
})

app.get('/app', function(req, res, next){
    res.sendFile(path.join(__dirname, 'build/index.html'));
    console.log('server side, *');
});
app.get('/', function(req, res, next){
    res.send('hello');
});

var server = app.listen(3333, function(err) {
    if (err){
        console.log(err);
        return;
    }
    var addr = server.address();
    console.log('Listening @ http://%s:%d', addr.address, addr.port);
});
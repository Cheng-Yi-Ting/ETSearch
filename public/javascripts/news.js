// Vue.component("news", {
//     template: "#news",
//     props: ["news_data"],
//     computed: {
//         bg_css: function() {
//             return {
//                 "background-image": "url('" + this.news_data.cover + "')"
//             }
//         }
//     }
// });
// 新聞內容dialog
Vue.component('modal', {
    template: '#modal-template'
})

// Vue.component('c-modal', {
//     template: '#c-modal-template'
// })

var vm = new Vue({
    el: "#app",

    data() {
        return {
            // baseUrl: 'http://localhost:3000', // API url
            baseUrl: 'http://' + window.location.hostname + ':3000', // API url
            // all_newsCat: ['社會', '旅遊', '地方', '寵物', '財經', '影劇', '大陸', '健康', '體育', '生活', '國際', '政治'],//新聞類別
            // all_newsCat: ['3C', '國際', '社會', '財經', '旅遊', '政治', '健康', '時尚', '地產','地方', '影劇', '體育', '生活', '遊戲', '寵物', '大陸'],
            // 顯示搜尋欄
            display_searchBar: {
                display: 'none'
            },
            // 顯示keywords list
            cat_keywords: {
                display: 'inline'
            },
            // 顯示搜尋類別
            searches_cat: {
                display: 'none',
                // position: 'fixed',
                // right: '50%',
                // left: '50%',

            },
            // 顯示搜尋字詞&結果數
            Number_of_searches: {
                display: 'none'
            },
            all_newsCat: ['熱門', '國際', '社會', '財經', '旅遊', '政治', '健康', '地方', '影劇', '體育', '生活', '寵物', '大陸'],
            popkeywords: [], //顯示的關鍵字
            all_popkeywords: [], //該類所有的關鍵字
            popKeywords_totalPage: 0, //有幾頁類別關鍵字
            currPage_popkeywords: 1, //目前為第幾頁類別關鍵字
            offsetFresh: 0,
            newsCat: '全部', //紀錄新聞類別，預設全部
            searchTerm: '', // Default search term
            searchResults: [], // Displayed search results
            user_searchResultsTemp: [],
            numHits: null, // Total search results length
            searchTerm: null,
            searchTermFlag: 0, //每次搜尋字詞
            searchOffset: 0, //跳過前面skip筆資料
            currPage: 1, // Search result pagination offset
            itemCounts: 40,
            // all_news: all_news,
            showModal: 0, //控制showModal組件，0:關閉，1:開啟
            url_closeModal: 1,
            NewsTitle: null, //modal的title
            NewsContent: null, //modal的content
            viewNews: null, //儲存瀏覽新聞，ES API搜尋用
            NewsUrl: null, //瀏覽新聞時，ES API搜尋用
            NewsKeywords: [],
            NewsKeywordsFre: [],
            isLogin: 0,
            rec_searchResults: [], // Displayed rec search results
            rec_searchResults_temp: [],
            rec_numHits: null, // Total rec search results length
            rec_News_all: null, //Total rec search results
            // mystyle: {
            //     color: 'red',
            //     fontSize: '30px'
            // },
            // 評分區顯示
            hide_rating: 1,
            // 評分項目value
            stars_1: null,
            stars_2: null,
            stars_3: null,
            // 平均評分
            stars_avg: null,
            // 平均評分顯示/隱藏
            stars_avg_Active: 0,
            // 重新評分
            re_stars_Active: 0,
            group_searchResults: [],
            isActive: null, //highlight點擊類別
            pop_isActive: null, //highlight點擊熱門關鍵字
            showMenu: null, //登入和註冊頁不顯示側邊欄
            user_searchResults: [],
            user_searchResults_temp: '',
            index_url: 'http://' + window.location.hostname + ':3000' + '/',
            rec_url: 'http://' + window.location.hostname + ':3000' + '/rec',
            info_url: 'http://' + window.location.hostname + ':3000' + '/Info',
            login_url: 'http://' + window.location.hostname + ':3000' + '/login',
            reg_url: 'http://' + window.location.hostname + ':3000' + '/reg',


        }
    },

    async created() {
        // this.search() // Search for default term
        this.menu_alter() //清空側欄/類別
        this.show_searchBar();

        if (window.location.href == this.index_url) {
            $(".cat_btn_disabled").attr("disabled", true); //關閉類別選項
            await this.TodaySearch()
            await this.day_popkeywords()
            $(".cat_btn_disabled").attr("disabled", false); //開啟類別選項
        }
        // await this.TodaySearch()
        // await this.day_popkeywords()
        // await this.TodaySearch()
        // await this.day_popkeywords()
        // temp = await this.TodaySearchItems()
        // console.log(temp)show_modal
        // console.log(this.searchResults)
        if (window.location.href == this.rec_url) {
            $(".cat_btn_disabled").attr("disabled", true); //關閉類別選項
            await this.rec_News()
            $(".cat_btn_disabled").attr("disabled", false); //開啟類別選項
        }
        // await this.rec_News()
        // await this.rec_AllNews()
        if (window.location.href == this.info_url) {
            $(".cat_btn_disabled").attr("disabled", true); //關閉類別選項
            await this.user_viewNews()
            $(".cat_btn_disabled").attr("disabled", false); //開啟類別選項
        }
        this.searchTerms = null


    },

    methods: {

        async menu_alter() {
            // login和reg頁面不顯示側欄，把類別清空
            if (window.location.href == this.login_url || window.location.href == this.reg_url) {
                this.all_newsCat = '';
            }
            // 推薦頁面，類別顯示
            if (window.location.href == this.rec_url) {
                // this.all_newsCat = '';
                // this.all_newsCat[0] = '熱門';
                // this.all_newsCat[1] = '歷史';
                for (i = 0; i < this.all_newsCat.length; i++) {
                    this.all_newsCat[i] = ''
                }
                // this.all_newsCat[0] = '熱門';
                // this.all_newsCat[0] = '隨機';
                // this.all_newsCat[1] = 'CB';
                // this.all_newsCat[2] = 'CF';


            }

            // 資訊頁面，類別顯示，不顯示熱門標籤
            if (window.location.href == this.info_url) {
                this.all_newsCat[0] = '';

            }



            // console.log(this.all_newsCat)
        },
        // 顯示搜尋Bar
        async show_searchBar() {
            // 首頁顯示SearchBar
            if (window.location.href == this.index_url) {
                this.display_searchBar.display = 'inline';
            }
        },
        // 隱藏搜尋Bar
        async hide_searchBar() {
            // 首頁hide SearchBar
            if (window.location.href == this.index_url) {
                this.display_searchBar.display = 'none';

            }
        },
        // 顯示搜尋字詞&結果數量
        async display_search_cat() {
            // 首頁顯示SearchBar
            if (window.location.href == this.index_url) {
                this.searches_cat.display = 'block';
            }
        },
        // 隱藏搜尋字詞&結果數量
        async hide_searches_cat() {
            // 首頁hide SearchBar
            if (window.location.href == this.index_url) {
                this.searches_cat.display = 'none';

            }
        },
        // 顯示搜尋字詞&結果數量
        async display_Number_of_searches() {
            // 首頁顯示SearchBar
            if (window.location.href == this.index_url) {
                this.Number_of_searches.display = 'inline';
            }
        },
        // 顯示keywords list
        async display_keywordsList() {
            // 首頁hide SearchBar
            if (window.location.href == this.index_url) {
                this.cat_keywords.display = 'inline';

            }
        },
        // 隱藏搜keywords list
        async hide_keywordsList() {
            // 首頁hide SearchBar
            if (window.location.href == this.index_url) {
                this.cat_keywords.display = 'none';

            }
        },
        // 隱藏搜尋字詞&結果數量
        async hide_Number_of_searches() {
            // 首頁hide SearchBar
            if (window.location.href == this.index_url) {
                this.Number_of_searches.display = 'none';

            }
        },
        async TodaySearch() {
            // Call Search API
            // this.searchResults = []
            this.searchTerm = null;
            const response = await axios.get(`${this.baseUrl}/TodaySearch`, {
                    params: {
                        offset: this.searchOffset
                    }
                })
                // console.log(response.data.hits.hits)
                // console.log(response.data.hits.hits.length)
                // console.log(this.searchOffset)
                // console.log(this.numHits)
                // console.log(response.data.hits.total)
                // 每次搜尋清除之前的搜尋結果
                // this.searchResults = []
            this.numHits = response.data.hits.total //新聞筆數

            // 將40筆新聞資料從_source取出，push to array，並取描述欄位的前一百個字當作簡介

            // for (i = 0; i < response.data.hits.hits.length; i++) {
            //     this.searchResults.push(response.data.hits.hits[i]._source)
            //     this.searchResults[i].description = response.data.hits.hits[i]._source.description.substr(0, 100) + '...'
            //     // 使用者已評分和未評分新聞項目
            //     let score = await this.check_rating(this.searchResults[i].url);
            //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
            //     this.searchResults[i]['score'] = score;
            // }
            const temp = []
            let newsCat;
            // response.data.hits.hits.length
            for (i = 0; i < response.data.hits.hits.length; i++) {
                // news_date = response.data.hits.hits[i]._source.date[0:9]
                // e.g:["社會","地方"]，地方.length==2
                if (response.data.hits.hits[i]._source.category[1].length == 2) {
                    newsCat = response.data.hits.hits[i]._source.category[0] + " | " + response.data.hits.hits[i]._source.category[1]
                } else {
                    newsCat = response.data.hits.hits[i]._source.category;
                }
                const newsObj = {
                    "website": response.data.hits.hits[i]._source.website,
                    "url": response.data.hits.hits[i]._source.url,
                    "title": response.data.hits.hits[i]._source.title,
                    "date": response.data.hits.hits[i]._source.date.replace("T", " "),
                    "content": response.data.hits.hits[i]._source.content,
                    "category": newsCat,
                    "image": response.data.hits.hits[i]._source.image,
                    "description": response.data.hits.hits[i]._source.description.substr(0, 100) + '...',
                    "keywords": response.data.hits.hits[i]._source.keywords,
                    "score": '未評分'

                }
                let score = await this.check_rating(newsObj.url);
                // Adding items to a JSON object，新增score欄位存放已評分/未評分
                newsObj.score = score;
                temp.push(newsObj)
            }

            this.searchResults = temp
                // $('.cat_btn_disabled').attr("disabled", false);//開啟類別選項
        },
        async day_popkeywords() {
            const response = await axios.get(`${this.baseUrl}/day_popkeywords`, {
                params: {
                    newsCat: this.newsCat
                }
            })
            this.currPage_popkeywords = 1;
            this.popkeywords = []
            this.all_popkeywords = []
                // response.data.length
            this.popKeywords_totalPage = Math.ceil(response.data.length / 10); //有幾頁關鍵字
            for (i = 0; i < response.data.length; i++) {
                // console.log(response.data[i])
                this.all_popkeywords.push(response.data[i]) //所有關鍵字
                    // 每類先顯示前10關鍵字
                if (i < 10) {
                    this.popkeywords.push(response.data[i])
                }
                // this.searchResults.push(response.data.hits.hits[i]._source)
                // this.searchResults[i].description = response.data.hits.hits[i]._source.description.substr(0, 100) + '...'
            }

        },
        async setPage_popkeywords(idx) {
            if (idx <= 0 || idx > this.popKeywords_totalPage) {
                return;
            }
            const start_index = idx * 10 - 10;
            this.currPage_popkeywords = idx;
            // console.log(this.currPage_popkeywords)
            this.popkeywords = []
            for (i = 0; i < 10; i++) {
                this.popkeywords[i] = this.all_popkeywords[start_index + i]

            }


        },

        async TodaySearch_term() {
            // this.searchResults = []
            // 無點擊類別&輸入字詞，新聞搜尋字詞(所有類別)
            if (this.newsCat == '全部' && this.searchTerm != null) {
                var response = await axios.get(`${this.baseUrl}/TodaySearch_term_All`, {
                    params: {
                        term: this.searchTerm,
                        offset: this.searchOffset
                    }

                })
            }
            // 點擊類別&輸入字詞，新聞搜尋字詞(特定類別)
            else if (this.newsCat != '全部' && this.searchTerm != null) {
                var response = await axios.get(`${this.baseUrl}/TodaySearch_term_Cat`, {
                    params: {
                        term: this.searchTerm,
                        newsCat: this.newsCat,
                        offset: this.searchOffset
                    }

                })
            }
            // }
            // // 新聞搜尋字詞(所有類別)
            // if (this.newsCat != null && this.searchTerm != null) {
            //     var response = await axios.get(`${this.baseUrl}/TodaySearch_term_Cat`, {
            //         params: {
            //             term: this.searchTerm,
            //             newsCat: this.newsCat,
            //             offset: this.searchOffset
            //         }

            //     })
            // }



            // 每次搜尋清除之前的搜尋結果
            // this.searchResults = []
            this.numHits = response.data.hits.total //新聞筆數
                // console.log(response)
                // for (i = 0; i < response.data.hits.hits.length; i++) {
                //     this.searchResults.push(response.data.hits.hits[i]._source)
                //     this.searchResults[i].description = response.data.hits.hits[i]._source.description.substr(0, 100) + '...'
                //     // 使用者已評分和未評分新聞項目
                //     let score = await this.check_rating(this.searchResults[i].url);
                //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
                //     this.searchResults[i]['score'] = score;
                // }
            const temp = []
            let newsCat;
            for (i = 0; i < response.data.hits.hits.length; i++) {
                if (response.data.hits.hits[i]._source.category[1].length == 2) {
                    newsCat = response.data.hits.hits[i]._source.category[0] + " | " + response.data.hits.hits[i]._source.category[1]
                } else {
                    newsCat = response.data.hits.hits[i]._source.category;
                }
                const newsObj = {
                    "website": response.data.hits.hits[i]._source.website,
                    "url": response.data.hits.hits[i]._source.url,
                    "title": response.data.hits.hits[i]._source.title,
                    "date": response.data.hits.hits[i]._source.date.replace("T", " "),
                    "content": response.data.hits.hits[i]._source.content,
                    "category": newsCat,
                    "image": response.data.hits.hits[i]._source.image,
                    "description": response.data.hits.hits[i]._source.description.substr(0, 100) + '...',
                    "keywords": response.data.hits.hits[i]._source.keywords,
                    "score": '未評分'

                }
                let score = await this.check_rating(newsObj.url);
                // Adding items to a JSON object，新增score欄位存放已評分/未評分
                newsObj.score = score;
                temp.push(newsObj)
            }
            this.searchResults = temp;
            // $('.cat_btn_disabled').attr("disabled", false);//開啟類別選項

        },
        async rec_News() {
            await axios.post('/user_rec', {})

            const response = await axios.get('/user_rec_all', {
                params: {
                    from: this.searchOffset
                }
            })
            this.rec_numHits = response.data.rec_newsLen;
            const news_response = await axios.post(`${this.baseUrl}/user_his_rec_search`, {
                user_recNews: response.data.rec_news,
            })

            // for (i = 0; i < news_response.data.length; i++) {
            //     this.rec_searchResults.push(news_response.data[i].hits.hits[0]._source)
            //     this.rec_searchResults[i].description = news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...'
            //     // 使用者已評分和未評分新聞項目
            //     let score = await this.check_rating(this.rec_searchResults[i].url);
            //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
            //     this.rec_searchResults[i]['score'] = score;
            // }
            const temp = [];
            this.rec_searchResults = []
            let newsCat;
            for (i = 0; i < news_response.data.length; i++) {
                if (news_response.data[i].hits.hits[0]._source.category[1].length == 2) {
                    newsCat = news_response.data[i].hits.hits[0]._source.category[0] + " | " + news_response.data[i].hits.hits[0]._source.category[1]
                } else {
                    newsCat = news_response.data[i].hits.hits[0]._source.category;
                }
                const newsObj = {
                    "website": news_response.data[i].hits.hits[0]._source.website,
                    "url": news_response.data[i].hits.hits[0]._source.url,
                    "title": news_response.data[i].hits.hits[0]._source.title,
                    "date": news_response.data[i].hits.hits[0]._source.date.replace("T", " "),
                    "content": news_response.data[i].hits.hits[0]._source.content,
                    "category": newsCat,
                    "image": news_response.data[i].hits.hits[0]._source.image,
                    "description": news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...',
                    "keywords": news_response.data[i].hits.hits[0]._source.keywords,
                    "score": '未評分'

                }
                let score = await this.check_rating(newsObj.url);
                // Adding items to a JSON object，新增score欄位存放已評分/未評分
                newsObj.score = score;
                temp.push(newsObj)
            }
            this.rec_searchResults = temp;


        },

        // 獲得所有推薦新聞URL
        async rec_AllNews() {
            this.rec_News_all = await axios.get('/rec_News_all', {})
        },
        // 使用者瀏覽紀錄
        async user_viewNews() {
            // Call viewNews Search API
            const response = await axios.get('/Read_viewNews', {})
            const Read_viewNews = []
            this.user_searchResultsTemp = []
                // 使用者有瀏覽過新聞
            if (response != null) {
                //從Mongodb獲取看過的新聞
                for (i = 0; i < response.data.length; i++) {
                    Read_viewNews.push(response.data[i])

                }
                // console.log(Read_viewNews)
                // 透過ES對每篇URL進行搜尋來獲取新聞
                // 使用post，get會因為url參數太常出現bad request
                const user_news_response = await axios.post(`${this.baseUrl}/user_viewNews`, {
                    Read_viewNews: Read_viewNews,

                })

                const temp = []
                let newsCat;
                for (i = 0; i < Read_viewNews.length; i++) {

                    if (user_news_response.data[i].hits.hits[0]._source.category[1].length == 2) {
                        newsCat = user_news_response.data[i].hits.hits[0]._source.category[0] + " | " + user_news_response.data[i].hits.hits[0]._source.category[1]
                    } else {
                        newsCat = user_news_response.data[i].hits.hits[0]._source.category;
                    }
                    const newsObj = {
                        "website": user_news_response.data[i].hits.hits[0]._source.website,
                        "url": user_news_response.data[i].hits.hits[0]._source.url,
                        "title": user_news_response.data[i].hits.hits[0]._source.title,
                        "date": user_news_response.data[i].hits.hits[0]._source.date.replace("T", " "),
                        "content": user_news_response.data[i].hits.hits[0]._source.content,
                        "category": newsCat,
                        "image": user_news_response.data[i].hits.hits[0]._source.image,
                        "description": user_news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...',
                        "keywords": user_news_response.data[i].hits.hits[0]._source.keywords,
                        "score": '未評分'

                    }

                    // this.user_searchResultsTemp[i].description = this.user_searchResultsTemp[i].description.substr(0, 100) + '...'
                    // this.user_searchResults.push(user_news_response.data.hits.hits[i])
                    // 使用者已評分和未評分新聞項目
                    let score = await this.check_rating(newsObj.url);
                    newsObj.score = score;
                    temp.push(newsObj)
                        // Adding items to a JSON object，新增score欄位存放已評分/未評分

                }
                this.user_searchResultsTemp = temp;
                // 先瀏覽的新聞先出現
                this.user_searchResults = this.user_searchResultsTemp.reverse();
                this.user_searchResults_temp = this.user_searchResults;
            }
        },
        // 以類別進行搜尋
        async Search_cat() {
            await this.show_searchBar()
            if (this.newsCat == '熱門') {
                // this.searchResults = []
                await this.hide_keywordsList();
                await this.hide_searchBar();
                const response = await axios.get(`${this.baseUrl}/pop_News`, {
                    params: {
                        from: this.searchOffset
                    }
                })
                this.numHits = response.data.pop_newsLen;
                const news_response = await axios.post(`${this.baseUrl}/pop_search`, {
                        url: response.data.pop_news,
                    })
                    // this.searchResults = []
                    // for (i = 0; i < news_response.data.length; i++) {
                    //     this.searchResults.push(news_response.data[i].hits.hits[0]._source)
                    //     this.searchResults[i].description = news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...'
                    //     // 使用者已評分和未評分新聞項目
                    //     let score = await this.check_rating(this.searchResults[i].url);
                    //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
                    //     this.searchResults[i]['score'] = score;
                    // }

                const temp = [];
                let newsCat;
                for (i = 0; i < news_response.data.length; i++) {
                    // console.log(news_response.data[i].hits.hits[0]._source.category)
                    // console.log(news_response.data[i].hits.hits[0]._source.category[1].length )
                    if (news_response.data[i].hits.hits[0]._source.category[1].length == 2) {
                        newsCat = news_response.data[i].hits.hits[0]._source.category[0] + " | " + news_response.data[i].hits.hits[0]._source.category[1]
                    } else {
                        newsCat = news_response.data[i].hits.hits[0]._source.category;
                    }
                    const newsObj = {
                        "website": news_response.data[i].hits.hits[0]._source.website,
                        "url": news_response.data[i].hits.hits[0]._source.url,
                        "title": news_response.data[i].hits.hits[0]._source.title,
                        "date": news_response.data[i].hits.hits[0]._source.date.replace("T", " "),
                        "content": news_response.data[i].hits.hits[0]._source.content,
                        "category": newsCat,
                        "image": news_response.data[i].hits.hits[0]._source.image,
                        "description": news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...',
                        "keywords": news_response.data[i].hits.hits[0]._source.keywords,
                        "score": '未評分'

                    }
                    let score = await this.check_rating(newsObj.url);
                    // Adding items to a JSON object，新增score欄位存放已評分/未評分
                    newsObj.score = score;
                    temp.push(newsObj)
                }
                this.searchResults = temp;
                // $('.cat_btn_disabled').attr("disabled", false);//開啟類別選項
                // const response = await axios.get(`${this.baseUrl}/date_popNews`, {
                //     params: {
                //         from: this.searchOffset
                //     }

                // })
                // this.numHits = response.data.pop_newsLen;

                // const news_response = await axios.post(`${this.baseUrl}/pop_search`, {
                //     url: response.data.pop_news,
                // })
                // this.searchResults = []

                // for (i = 0; i < news_response.data.length; i++) {
                //     this.searchResults.push(news_response.data[i].hits.hits[0]._source)
                //     this.searchResults[i].description = news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...'
                //     // 使用者已評分和未評分新聞項目
                //     let score = await this.check_rating(this.searchResults[i].url);
                //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
                //     this.searchResults[i]['score'] = score;
                // }
                // console.log(this.searchResults)
            } else {
                // console.log(this.searchResults.length)
                // this.searchResults = []
                // console.log('123');
                await this.display_keywordsList();
                const response = await axios.get(`${this.baseUrl}/Search_cat`, {
                        params: {
                            term: this.newsCat,
                            offset: this.searchOffset
                        }

                    })
                    // console.log(response.data)
                    // this.searchResults = []
                this.numHits = response.data.hits.total //新聞筆數
                    // console.log(response)
                    // for (i = 0; i < response.data.hits.hits.length; i++) {
                    //     this.searchResults.push(response.data.hits.hits[i]._source)
                    //     this.searchResults[i].description = response.data.hits.hits[i]._source.description.substr(0, 100) + '...'
                    //     // 使用者已評分和未評分新聞項目
                    //     let score = await this.check_rating(this.searchResults[i].url);
                    //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
                    //     this.searchResults[i]['score'] = score;
                    // }
                    // console.log(response.data.hits.hits.length)
                const temp = [];
                let newsCat;
                for (i = 0; i < response.data.hits.hits.length; i++) {
                    if (response.data.hits.hits[i]._source.category[1].length == 2) {
                        newsCat = response.data.hits.hits[i]._source.category[0] + " | " + response.data.hits.hits[i]._source.category[1]
                    } else {
                        newsCat = response.data.hits.hits[i]._source.category;
                    }
                    const newsObj = {
                        "website": response.data.hits.hits[i]._source.website,
                        "url": response.data.hits.hits[i]._source.url,
                        "title": response.data.hits.hits[i]._source.title,
                        "date": response.data.hits.hits[i]._source.date.replace("T", " "),
                        "content": response.data.hits.hits[i]._source.content,
                        "category": newsCat,
                        "image": response.data.hits.hits[i]._source.image,
                        "description": response.data.hits.hits[i]._source.description.substr(0, 100) + '...',
                        "keywords": response.data.hits.hits[i]._source.keywords,
                        "score": '未評分'

                    }
                    let score = await this.check_rating(newsObj.url);
                    // Adding items to a JSON object，新增score欄位存放已評分/未評分
                    newsObj.score = score;
                    temp.push(newsObj)
                }
                // console.log(temp.length);
                // $('.cat_btn_disabled').attr("disabled", false);//開啟類別選項
                this.searchResults = temp;
                // console.log(this.searchResults.length)


            }



        },

        // 推薦頁面
        async Search_rec() {
            // console.log(this.newsCat)
            // check_rating前先顯示每一個項目為未評分
            // for (i = 0; i < this.rec_searchResults.length; i++) {
            //     this.rec_searchResults[i]['score'] = '未評分';
            // }


            // if (this.newsCat == '熱門') {
            //     const response = await axios.get(`${this.baseUrl}/pop_News`, {
            //         params: {
            //             from: this.searchOffset
            //         }
            //     })
            //     this.rec_numHits = response.data.pop_newsLen;
            //     const news_response = await axios.post(`${this.baseUrl}/pop_search`, {
            //         url: response.data.pop_news,
            //     })
            //     // for (i = 0; i < news_response.data.length; i++) {
            //     //     this.rec_searchResults.push(news_response.data[i].hits.hits[0]._source)
            //     //     this.rec_searchResults[i].description = news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...'
            //     //     // 使用者已評分和未評分新聞項目
            //     //     let score = await this.check_rating(this.rec_searchResults[i].url);
            //     //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
            //     //     this.rec_searchResults[i]['score'] = score;
            //     // }
            //     const temp = [];
            //     this.rec_searchResults = []
            //     let newsCat;
            //     for (i = 0; i < news_response.data.hits.hits.length; i++) {
            //         if (news_response.data[i].hits.hits[0]._source.category[1].length == 2) {
            //             newsCat = news_response.data[i].hits.hits[0]._source.category[0] + " | " + news_response.data[i].hits.hits[0]._source.category[1]
            //         }
            //         else {
            //             newsCat = news_response.data[i].hits.hits[0]._source.category;
            //         }

            //         const newsObj = {
            //             "website": news_response.data[i].hits.hits[0]._source.website,
            //             "url": news_response.data[i].hits.hits[0]._source.url,
            //             "title": news_response.data[i].hits.hits[0]._source.title,
            //             "date": news_response.data[i].hits.hits[0]._source.date.replace("T", " "),
            //             "content": news_response.data[i].hits.hits[0]._source.content,
            //             "category": newsCat,
            //             "image": news_response.data[i].hits.hits[0]._source.image,
            //             "description": news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...',
            //             "keywords": news_response.data[i].hits.hits[0]._source.keywords,
            //             "score": '未評分'

            //         }
            //         let score = await this.check_rating(newsObj.url);
            //         // Adding items to a JSON object，新增score欄位存放已評分/未評分
            //         newsObj.score = score;
            //         temp.push(newsObj)
            //     }
            //     this.rec_searchResults = temp;


            // }
            if (this.newsCat == '全部') {
                const response = await axios.get('/user_rec_all', {
                    params: {
                        from: this.searchOffset
                    }
                })
                this.rec_numHits = response.data.rec_newsLen;
                const news_response = await axios.post(`${this.baseUrl}/user_his_rec_search`, {
                    user_recNews: response.data.rec_news,
                })

                // for (i = 0; i < news_response.data.length; i++) {
                //     this.rec_searchResults.push(news_response.data[i].hits.hits[0]._source)
                //     this.rec_searchResults[i].description = news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...'
                //     // 使用者已評分和未評分新聞項目
                //     let score = await this.check_rating(this.rec_searchResults[i].url);
                //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
                //     this.rec_searchResults[i]['score'] = score;
                // }
                const temp = [];
                this.rec_searchResults = []
                let newsCat;
                for (i = 0; i < news_response.data.length; i++) {
                    if (news_response.data[i].hits.hits[0]._source.category[1].length == 2) {
                        newsCat = news_response.data[i].hits.hits[0]._source.category[0] + " | " + news_response.data[i].hits.hits[0]._source.category[1]
                    } else {
                        newsCat = news_response.data[i].hits.hits[0]._source.category;
                    }
                    const newsObj = {
                        "website": news_response.data[i].hits.hits[0]._source.website,
                        "url": news_response.data[i].hits.hits[0]._source.url,
                        "title": news_response.data[i].hits.hits[0]._source.title,
                        "date": news_response.data[i].hits.hits[0]._source.date.replace("T", " "),
                        "content": news_response.data[i].hits.hits[0]._source.content,
                        "category": newsCat,
                        "image": news_response.data[i].hits.hits[0]._source.image,
                        "description": news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...',
                        "keywords": news_response.data[i].hits.hits[0]._source.keywords,
                        "score": '未評分'

                    }
                    let score = await this.check_rating(newsObj.url);
                    // Adding items to a JSON object，新增score欄位存放已評分/未評分
                    newsObj.score = score;
                    temp.push(newsObj)
                }
                this.rec_searchResults = temp;

            }

            if (this.newsCat == '隨機') {
                console.log('隨機')
                const response = await axios.get('/randomNews', {

                })
                console.log(response)
                    // console.log(response)
                    // this.rec_numHits = 10;
                const news_response = await axios.post(`${this.baseUrl}/random_search`, {
                    random_news: response.data,
                })

                // console.log(news_response)

                const temp = [];
                this.rec_searchResults = []
                let newsCat;
                for (i = 0; i < news_response.data.length; i++) {
                    if (news_response.data[i].hits.hits[0]._source.category[1].length == 2) {
                        newsCat = news_response.data[i].hits.hits[0]._source.category[0] + " | " + news_response.data[i].hits.hits[0]._source.category[1]
                    } else {
                        newsCat = news_response.data[i].hits.hits[0]._source.category;
                    }
                    const newsObj = {
                        "website": news_response.data[i].hits.hits[0]._source.website,
                        "url": news_response.data[i].hits.hits[0]._source.url,
                        "title": news_response.data[i].hits.hits[0]._source.title,
                        "date": news_response.data[i].hits.hits[0]._source.date.replace("T", " "),
                        "content": news_response.data[i].hits.hits[0]._source.content,
                        "category": newsCat,
                        "image": news_response.data[i].hits.hits[0]._source.image,
                        "description": news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...',
                        "keywords": news_response.data[i].hits.hits[0]._source.keywords,
                        "score": '未評分'

                    }
                    let score = await this.check_rating(newsObj.url);
                    // Adding items to a JSON object，新增score欄位存放已評分/未評分
                    newsObj.score = score;
                    temp.push(newsObj)
                }
                this.rec_searchResults = temp;



            }

            if (this.newsCat == 'CB') {
                const response = await axios.get('/user_his_rec', {
                    params: {
                        from: this.searchOffset
                    }
                })
                this.rec_numHits = response.data.rec_newsLen;
                const news_response = await axios.post(`${this.baseUrl}/user_his_rec_search`, {
                    user_recNews: response.data.rec_news,
                })

                // for (i = 0; i < news_response.data.length; i++) {
                //     this.rec_searchResults.push(news_response.data[i].hits.hits[0]._source)
                //     this.rec_searchResults[i].description = news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...'
                //     // 使用者已評分和未評分新聞項目
                //     let score = await this.check_rating(this.rec_searchResults[i].url);
                //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
                //     this.rec_searchResults[i]['score'] = score;
                // }
                const temp = [];
                this.rec_searchResults = []
                let newsCat;
                for (i = 0; i < news_response.data.length; i++) {
                    if (news_response.data[i].hits.hits[0]._source.category[1].length == 2) {
                        newsCat = news_response.data[i].hits.hits[0]._source.category[0] + " | " + news_response.data[i].hits.hits[0]._source.category[1]
                    } else {
                        newsCat = news_response.data[i].hits.hits[0]._source.category;
                    }
                    const newsObj = {
                        "website": news_response.data[i].hits.hits[0]._source.website,
                        "url": news_response.data[i].hits.hits[0]._source.url,
                        "title": news_response.data[i].hits.hits[0]._source.title,
                        "date": news_response.data[i].hits.hits[0]._source.date.replace("T", " "),
                        "content": news_response.data[i].hits.hits[0]._source.content,
                        "category": newsCat,
                        "image": news_response.data[i].hits.hits[0]._source.image,
                        "description": news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...',
                        "keywords": news_response.data[i].hits.hits[0]._source.keywords,
                        "score": '未評分'

                    }
                    let score = await this.check_rating(newsObj.url);
                    // Adding items to a JSON object，新增score欄位存放已評分/未評分
                    newsObj.score = score;
                    temp.push(newsObj)
                }
                this.rec_searchResults = temp;



            }

            if (this.newsCat == 'CF') {
                const response = await axios.get('/user_cf_rec', {
                        params: {
                            from: this.searchOffset
                        }
                    })
                    // console.log(response)
                this.rec_numHits = response.data.rec_newsLen;
                const news_response = await axios.post(`${this.baseUrl}/user_his_rec_search`, {
                    user_recNews: response.data.rec_news,
                })

                // for (i = 0; i < news_response.data.length; i++) {
                //     this.rec_searchResults.push(news_response.data[i].hits.hits[0]._source)
                //     this.rec_searchResults[i].description = news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...'
                //     // 使用者已評分和未評分新聞項目
                //     let score = await this.check_rating(this.rec_searchResults[i].url);
                //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
                //     this.rec_searchResults[i]['score'] = score;
                // }
                const temp = [];
                this.rec_searchResults = []
                let newsCat;
                for (i = 0; i < news_response.data.length; i++) {
                    if (news_response.data[i].hits.hits[0]._source.category[1].length == 2) {
                        newsCat = news_response.data[i].hits.hits[0]._source.category[0] + " | " + news_response.data[i].hits.hits[0]._source.category[1]
                    } else {
                        newsCat = news_response.data[i].hits.hits[0]._source.category;
                    }
                    const newsObj = {
                        "website": news_response.data[i].hits.hits[0]._source.website,
                        "url": news_response.data[i].hits.hits[0]._source.url,
                        "title": news_response.data[i].hits.hits[0]._source.title,
                        "date": news_response.data[i].hits.hits[0]._source.date.replace("T", " "),
                        "content": news_response.data[i].hits.hits[0]._source.content,
                        "category": newsCat,
                        "image": news_response.data[i].hits.hits[0]._source.image,
                        "description": news_response.data[i].hits.hits[0]._source.description.substr(0, 100) + '...',
                        "keywords": news_response.data[i].hits.hits[0]._source.keywords,
                        "score": '未評分'

                    }
                    let score = await this.check_rating(newsObj.url);
                    // Adding items to a JSON object，新增score欄位存放已評分/未評分
                    newsObj.score = score;
                    temp.push(newsObj)
                }
                this.rec_searchResults = temp;



            }

        },
        async Search_cat_rec() {

            // this.searchOffset = 0;
            // const rec_url = []
            // const response = await axios.get('/rec_News_all', {})
            // for (i = 0; i < this.rec_News_all.data.length; i++) {
            //     rec_url.push(this.rec_News_all.data[i])
            // }
            // console.log(rec_url)
            // 透過ES對每篇URL進行搜尋來獲取新聞
            const news_response = await axios.post(`${this.baseUrl}/cat_recNews`, {
                rec_url: this.rec_News_all.data,
                cat: this.newsCat,
                from: this.searchOffset

            })
            this.rec_numHits = news_response.data.rec_cat_total
                // console.log(this.rec_numHits)
            this.rec_searchResults = []
            for (i = 0; i < news_response.data.newsList.length; i++) {
                this.rec_searchResults.push(news_response.data.newsList[i].hits.hits[0]._source)
                this.rec_searchResults[i].description = this.rec_searchResults[i].description.substr(0, 100) + '...'
                    // 使用者已評分和未評分新聞項目
                let score = await this.check_rating(this.rec_searchResults[i].url);
                // Adding items to a JSON object，新增score欄位存放已評分/未評分
                this.rec_searchResults[i]['score'] = score;

            }

            // console.log(news_response)
            // for (i = 0; i < this.rec_searchResults.length; i++) {

            //     if (this.rec_searchResults[i].category == cat) {
            //         // match到的類別往前放
            //         this.rec_searchResults[num] = this.rec_searchResults[i]
            //         num += 1

            //     }
            // }
            // // 刪除不是該類別的新聞
            // this.rec_searchResults.splice(num, this.rec_searchResults.length);
            // // console.log(this.user_searchResults.length)
            // // console.log(num)
            // // this.user_searchResults = user_searchResultsTemp;


        },
        async Search_cat_info(id, cat) {
            var num = 0
                // await this.user_viewNews();

            this.user_searchResults = []
            const temp = []

            for (i = 0; i < this.user_searchResults_temp.length; i++) {
                temp.push(this.user_searchResults_temp[i])
                    // 使用者已評分和未評分新聞項目
                    // Adding items to a JSON object，新增score欄位存放已評分/未評分
            }

            for (i = 0; i < temp.length; i++) {
                // 雙類別，e.g:生活 | 健康，長度=7
                if (temp[i].category.length == 7) {
                    let newsCat = [];
                    let cat_str = temp[i].category.replace(/\s+/g, ""); //去空白
                    cat_str = cat_str.replace("|", ""); //去|
                    newsCat[0] = cat_str.substring(0, 2) //first cat
                    newsCat[1] = cat_str.substring(2, 4) //second cat
                        // console.log(newsCat);
                        // match到其中一類別
                    if (newsCat[0] == cat || newsCat[1] == cat) {
                        temp[num] = temp[i]
                        num += 1
                    }


                }
                // 單類別
                else {
                    if (temp[i].category == cat) {
                        // console.log(category[1].length)
                        // match到的類別往前放
                        temp[num] = temp[i]
                        num += 1

                    }
                }

            }
            // 刪除不是該類別的新聞
            temp.splice(num, temp.length);
            this.user_searchResults = temp;
            // console.log(this.user_searchResults.length)
            // console.log(num)
            // this.user_searchResults = user_searchResultsTemp;


        },
        // Highlight所點擊的類別，呼叫Search API
        async clickOnCat(id, cat) {
            // console.log(id)
            this.hide_Number_of_searches();
            this.display_search_cat();
            this.searchTerm = null;
            this.isActive = id;
            this.newsCat = cat;
            this.currPage = 1;
            this.pop_isActive = null
                // 每次搜尋跳回第一頁
            this.searchOffset = (this.currPage - 1) * 40


            // var text = this.$el.querySelector(".nav li:nth-child(5)").innerText;
            // var text = $(".cat_btn");
            $(".cat_btn_disabled").attr("disabled", true); //關閉類別選項
            // $('.cat_btn_disabled').attr("disabled", false);//開啟類別選項
            // console.log(text);
            if (window.location.href == this.index_url) {
                await this.Search_cat();

            } else if (window.location.href == this.rec_url) {
                await this.Search_rec();
            } else {
                await this.Search_cat_info(id, cat);
            }
            // 該類別的熱門關鍵字
            await this.day_popkeywords()
            $(".cat_btn_disabled").attr("disabled", false); //開啟類別選項
        },
        async clickOnkeyowrds(keyowrds, id) {
            this.display_Number_of_searches();
            this.hide_searches_cat();
            this.searchResults = []
            this.searchTerm = keyowrds;
            this.pop_isActive = id;
            this.currPage = 1;
            $('.cat_btn_disabled').attr("disabled", true); //關閉類別選項
            if (this.newsCat == '全部') {
                var response = await axios.get(`${this.baseUrl}/TodaySearch_term_All`, {
                    params: {
                        term: this.searchTerm,
                        offset: 0
                    }

                })

            } else {
                var response = await axios.get(`${this.baseUrl}/SearchKeywords`, {
                    params: {
                        newsCat: this.newsCat,
                        keyowrds: keyowrds,
                        offset: 0
                    }


                })
            }

            // 每次搜尋清除之前的搜尋結果
            // this.searchResults = []
            this.numHits = response.data.hits.total //新聞筆數
                // console.log(response)
                // for (i = 0; i < response.data.hits.hits.length; i++) {
                //     this.searchResults.push(response.data.hits.hits[i]._source)
                //     this.searchResults[i].description = response.data.hits.hits[i]._source.description.substr(0, 100) + '...'
                //     // 使用者已評分和未評分新聞項目
                //     let score = await this.check_rating(this.searchResults[i].url);
                //     // Adding items to a JSON object，新增score欄位存放已評分/未評分
                //     this.searchResults[i]['score'] = score;
                // }
            const temp = [];
            let newsCat;
            for (i = 0; i < response.data.hits.hits.length; i++) {
                if (response.data.hits.hits[i]._source.category[1].length == 2) {
                    newsCat = response.data.hits.hits[i]._source.category[0] + " | " + response.data.hits.hits[i]._source.category[1]
                } else {
                    newsCat = response.data.hits.hits[i]._source.category;
                }
                const newsObj = {
                    "website": response.data.hits.hits[i]._source.website,
                    "url": response.data.hits.hits[i]._source.url,
                    "title": response.data.hits.hits[i]._source.title,
                    "date": response.data.hits.hits[i]._source.date.replace("T", " "),
                    "content": response.data.hits.hits[i]._source.content,
                    "category": newsCat,
                    "image": response.data.hits.hits[i]._source.image,
                    "description": response.data.hits.hits[i]._source.description.substr(0, 100) + '...',
                    "keywords": response.data.hits.hits[i]._source.keywords,
                    "score": '未評分'

                }
                let score = await this.check_rating(newsObj.url);
                // Adding items to a JSON object，新增score欄位存放已評分/未評分
                newsObj.score = score;
                temp.push(newsObj)
            }
            this.searchResults = temp;
            $('.cat_btn_disabled').attr("disabled", false); //開啟類別選項

            // console.log(response.data)
            this.offsetFresh += 1
        },

        bg_css: function(id) {
            return {
                "background-image": "url('" + this.searchResults[id].image + "')"
            }
        },
        rec_bg_css: function(id) {
            return {
                "background-image": "url('" + this.rec_searchResults[id].image + "')"
            }
        },
        user_bg_css: function(id) {
            return {
                "background-image": "url('" + this.user_searchResults[id].image + "')"
            }
        },
        async is_Login(flag) {
            if (flag == 0) {
                this.isLogin = 0;
            } else {
                this.isLogin = 1;
            }
        },
        // 點擊評分區
        async stars_checked() {
            // const text = this.$el.querySelector(".nav li:nth-child(5)")
            // var radios = $('input:radio[id=star_1-5]');


            // $('input:radio[id=star_1-5]').attr('checked', true);
            // 使用者登入，紀錄新聞評分
            const text = this.$el.querySelector(".nav li:nth-child(5)").innerText;
            if (text.length != 0) {

                // 完成3項目評分
                if (this.stars_1 != null && this.stars_2 != null && this.stars_3 != null) {

                    this.stars_avg = (Number(this.stars_1) + Number(this.stars_2) + Number(this.stars_3)) / 3;

                    // 使用Math.floor()無條件捨去到小數點第1位
                    this.stars_avg = Math.floor(this.stars_avg * 10) / 10;
                    // 固定評分格式，e.g:顯示5.0，而不是5
                    this.stars_avg = "" + this.stars_avg;
                    if (this.stars_avg.length == 1) {
                        this.stars_avg = Number(this.stars_avg)
                        this.stars_avg = this.stars_avg.toFixed(1)
                    }
                    this.stars_avg_Active = 1; //顯示星
                    this.re_stars_Active = 1; //顯示reset
                    // 紀錄點擊首頁新聞，不紀錄瀏覽紀錄點擊新聞
                    // if (window.location.href == this.info_url) {
                    //     return;
                    // }
                    // // console.log(news.url)
                    // 檢查使用者新聞評分紀錄
                    const response_rating = await axios.post(`/check_viewNews_rating`, {
                        url: this.NewsUrl

                    })

                    // // yes:沒評分記錄，將評分寫入，true:有評分記錄，更新評分
                    if (response_rating.data == 'no') {
                        axios.post('/save_RatingNews', {
                                url: this.NewsUrl,
                                stars_avg: this.stars_avg,
                                stars_1: this.stars_1,
                                stars_2: this.stars_2,
                                stars_3: this.stars_3,


                            })
                            // await axios.get(`/check_viewNews_limit`, {})
                    } else {
                        axios.post('/update_RatingNews', {
                            url: this.NewsUrl,
                            stars_avg: this.stars_avg,
                            stars_1: this.stars_1,
                            stars_2: this.stars_2,
                            stars_3: this.stars_3,
                        })
                    }


                    // 顯示已評分
                    if (window.location.href == this.index_url) {
                        for (i = 0; i < this.searchResults.length; i++) {
                            if (this.searchResults[i]['url'] == this.NewsUrl) {
                                this.searchResults[i]['score'] = '已評分';
                            }
                        }
                    }

                    // 顯示已評分
                    if (window.location.href == this.rec_url) {
                        for (i = 0; i < this.rec_searchResults.length; i++) {
                            if (this.rec_searchResults[i]['url'] == this.NewsUrl) {
                                this.rec_searchResults[i]['score'] = '已評分';
                            }
                        }
                    }

                    // 顯示已評分
                    if (window.location.href == this.info_url) {
                        for (i = 0; i < this.user_searchResultsTemp.length; i++) {
                            if (this.user_searchResultsTemp[i]['url'] == this.NewsUrl) {
                                this.user_searchResultsTemp[i]['score'] = '已評分';
                            }
                        }
                    }

                    axios.post('/cf_rec', {
                        viewNewsURL: this.NewsUrl
                    })




                }



            }


        },
        // 清空所有星/評分
        stars_empty() {
            // 設定星星點擊
            // $('input:radio[id=star_1-3]').click();
            // 清空第一組星星
            var radioValue = $("input[name='star_1']:checked").val();
            // radioValue = "" + radioValue;
            set_radio_false = 'star_1-' + radioValue;
            // $('input:radio[id="set_false"]').prop('checked', false);
            $("input[id=" + set_radio_false + "]").prop('checked', false);

            // 清空第二組星星
            radioValue = $("input[name='star_2']:checked").val();
            set_radio_false = 'star_2-' + radioValue;
            $("input[id=" + set_radio_false + "]").prop('checked', false);

            // 清空第三組星星
            radioValue = $("input[name='star_3']:checked").val();
            set_radio_false = 'star_3-' + radioValue;
            $("input[id=" + set_radio_false + "]").c('checked', false);

            this.stars_1 = null;
            this.stars_2 = null;
            this.stars_3 = null;
            this.stars_avg = null; //隱藏平均評分
            this.stars_avg_Active = 0; //隱藏星
            this.re_stars_Active = 0; //隱藏reset

            // 刪除新聞評分紀錄
            axios.post('/delete_RatingNews', {
                url: this.NewsUrl,
            })

            // 清空，顯示未評分
            if (window.location.href == this.index_url) {
                for (i = 0; i < this.searchResults.length; i++) {
                    if (this.searchResults[i]['url'] == this.NewsUrl) {
                        this.searchResults[i]['score'] = '未評分';
                    }
                }
            }

            // 清空，顯示未評分
            if (window.location.href == this.rec_url) {
                for (i = 0; i < this.rec_searchResults.length; i++) {
                    if (this.rec_searchResults[i]['url'] == this.NewsUrl) {
                        this.rec_searchResults[i]['score'] = '未評分';
                    }
                }
            }

            // 顯示未評分
            if (window.location.href == this.info_url) {
                for (i = 0; i < this.user_searchResultsTemp.length; i++) {
                    if (this.user_searchResultsTemp[i]['url'] == this.NewsUrl) {
                        this.user_searchResultsTemp[i]['score'] = '未評分';
                    }
                }
            }

            axios.post('/cf_rec', {
                viewNewsURL: this.NewsUrl
            })



        },
        // 判斷使用者已評分和未評分新聞項目
        async check_rating(url) {
            const response_rating = await axios.post(`/check_viewNews_rating`, {
                url: url

            })

            if (response_rating.data == 'yes') {
                return '已評分';
            } else {
                return '未評分';
            }
        },

        async show_modal(news, id) {
            // `this` inside methods points to the Vue instance
            // alert('Hello ' + this.name + '!')

            this.showModal = 1; //顯示modal
            if (this.url_closeModal == 0) {
                this.showModal = 0;
            }
            this.url_closeModal = 1; //點擊url不顯示modal
            this.NewsTitle = news.title;
            this.NewsContent = news.content;
            this.NewsKeywords = []
            for (i = 0; i < news.keywords.length; i++) {

                this.NewsKeywords.push(news.keywords[i][0]);

            }
            // this.NewsKeywords = news.keywords;
            this.NewsUrl = news.url;
            // console.log(this.NewsKeywordsFre)
            this.NewsKeywordsFre = news.frequency;

            this.viewNews = {
                    category: news.category,
                    content: news.content,
                    date: news.date,
                    description: news.description,
                    image: news.image,
                    title: news.title,
                    url: news.url,
                    website: news.website
                }
                // console.log(this.viewNews)
                //呼叫API， 存放使用者瀏覽過的新聞
                // axios.defaults.withCredentials = true
                // axios.post('/viewNews',
                //     this.viewNews, // the data to post
                //     {
                //         headers: {
                //             'Content-type': 'application/x-www-form-urlencoded',
                //         }
                //     }).then(function(response) {

            //     // console.log('123')
            //     /* 成功拿到資料，然後... */
            // })
            // axios.get('/viewNews')
            //     .then(function(response) {

            //         // console.log('123')
            //         /* 成功拿到資料，然後... */
            //     })
            //     .catch(function(error) {
            //         /* 失敗，發生錯誤，然後...*/
            //     });
            // console.log(window.location.href)

            // 判斷是否登入，text=註冊 or 登出

            // group news
            // 取出新聞的group url 
            const response = await axios.post(`/news_group`, {
                    url: this.viewNews.url

                })
                // display top 4 news
            this.group_searchResults = []
            let dataLen = response.data.length
            if (dataLen > 4) {
                dataLen = 4;
            }
            for (i = 0; i < dataLen; i++) {
                this.group_searchResults.push(response.data[i])

            }
            // 取出新聞的group news
            const response_news = await axios.post(`/group_search`, {
                url: this.group_searchResults

            })

            this.group_searchResults = []

            for (i = 0; i < response_news.data.length; i++) {
                // this.group_searchResults.push(response_news.data[i].hits.hits[0]._source.title)
                this.group_searchResults.push(response_news.data[i].hits.hits[0]._source)
                this.group_searchResults[i].description = response_news.data[i].hits.hits[0]._source.description.substr(0, 50) + '...'


            }
            // console.log(this.group_searchResults)
            // this.group_searchResults = []
            // for (i = 0; i < this.group_searchResults.length; i++) {
            //     this.group_searchResults.push(group_searchResults[i])

            // }
            // for (i = 0; i < this.group_searchResults.length; i++) {
            //     console.log(this.group_searchResults[i])

            // }

            var text = this.$el.querySelector(".nav li:nth-child(5)").innerText;

            // text.length != 0 => user login
            if (text.length != 0) {
                this.hide_rating = 0;
                // 紀錄點擊首頁新聞，不紀錄瀏覽紀錄點擊新聞
                // if (window.location.href == this.info_url) {
                //     return;
                // }
                const response = await axios.post(`/check_viewNews`, {
                        url: this.viewNews.url

                    })
                    // axios.post('/his_rec', {
                    //     viewNewsURL: this.viewNews.url
                    // })
                    // axios.post('/his_rec', {
                    //     viewNewsURL: this.viewNews.url
                    // })

                //  yes:沒瀏覽記錄，將新聞寫入，true:有瀏覽記錄，不寫入新聞

                if (response.data == 'no') {
                    axios.post('/viewNews', {
                        viewNewsURL: this.viewNews.url
                    })

                    // user history rec
                    axios.post('/his_rec', {
                        viewNewsURL: this.viewNews.url
                    })

                    // user cat rec
                    let news_cat = this.viewNews.category;
                    let cat_string = '';
                    // check two cat news
                    if (news_cat.length > 2) {
                        cat_string = cat_string + news_cat[0] + news_cat[1] + news_cat[5] + news_cat[6];
                    }
                    // one cat news
                    else {
                        cat_string = news_cat;
                    }


                    axios.post('/cat_rec', {
                        cat: cat_string
                    })
                    await axios.post('/user_rec', {})
                        // user cf rec
                        // axios.post('/cf_rec', {
                        //     viewNewsURL: this.viewNews.url
                        // })
                        // await axios.get(`/check_viewNews_limit`, {})
                }
                // 記錄使用者瀏覽記錄前n筆新聞，其餘刪除
                // await axios.get(`/check_viewNews_limit`, {})

                // 判斷使用者是否評分過該篇新聞
                const response_rating = await axios.post(`/check_viewNews_rating`, {
                        url: this.NewsUrl

                    })
                    // //  yes:有評分記錄，讀取該篇評分
                if (response_rating.data == 'yes') {
                    const response_fetch_rating = await axios.post(`/fetch_rating`, {
                            url: this.NewsUrl

                        })
                        // console.log(response_fetch_rating);
                        // console.log(response_fetch_rating.data["url"]);
                        // console.log(response_fetch_rating.data["score"][0]);
                        // 設置評分
                    this.stars_avg = response_fetch_rating.data["score"][0]
                    this.stars_1 = response_fetch_rating.data["score"][1]
                    this.stars_2 = response_fetch_rating.data["score"][2]
                    this.stars_3 = response_fetch_rating.data["score"][3]
                    this.stars_avg_Active = 1; //顯示星
                    this.re_stars_Active = 1; //顯示reset
                    // // await axios.get(`/check_viewNews_limit`, {})
                } else {
                    this.stars_avg_Active = 0; //隱藏星
                    this.re_stars_Active = 0; //隱藏reset
                    // 沒有評分記錄，清空評分
                    this.stars_avg = null;
                    this.stars_1 = null;
                    this.stars_2 = null;
                    this.stars_3 = null;
                }

            } else {
                this.hide_rating = 1;
            }


            // console.log(response.data.hits.hits[0]._source)

            // console.log(this.NewsKeywordsFre)
            // console.log(news)
            // console.log(id)
            // `event` is the native DOM event
        },

        async setPage(idx) {
            // 新聞超過<0或超過頁數
            $('.cat_btn_disabled').attr("disabled", true); //關閉類別選項


            if (window.location.href == this.index_url) {
                // await this.day_popkeywords()

                if (idx <= 0 || idx > this.totalPage()) {
                    $('.cat_btn_disabled').attr("disabled", false); //開啟類別選項
                    return;
                }
            }
            if (window.location.href == this.rec_url) {
                if (idx <= 0 || idx > this.rec_totalPage()) {
                    $('.cat_btn_disabled').attr("disabled", false); //開啟類別選項
                    return;
                }
            }
            this.currPage = idx;
            this.searchOffset = (this.currPage - 1) * 40


            // this.skip = this.limit - 40
            // 搜尋字詞
            // if (window.location.href == this.index_url) {
            //     await this.Search_cat()
            // }


            if (window.location.href == this.index_url) {
                // 無點擊類別&無輸入字詞
                if (this.newsCat == '全部' && this.searchTerm == null) {

                    await this.TodaySearch()
                }
                // 無點擊類別&輸入字詞
                else if (this.newsCat == '全部' && this.searchTerm != null) {
                    await this.TodaySearch_term()
                }
                // 點擊類別&輸入字詞
                else if (this.newsCat != '全部' && this.searchTerm != null) {

                    await this.TodaySearch_term()
                }
                // 點擊類別
                else if (this.newsCat != '全部' && this.searchTerm == null) {
                    await this.Search_cat();
                }

            }
            if (window.location.href == this.rec_url) {
                await this.Search_rec();
                // 無點擊類別
                // if (this.newsCat == '全部') {

                //     await this.rec_News();
                // }
                // else {
                //     await this.Search_cat_rec();
                // }
                // await this.rec_News();
            }
            $('.cat_btn_disabled').attr("disabled", false); //開啟類別選項
            // await this.Search_cat()
            // if (this.newsCatFlag != null) {
            //     // console.log('445456')
            //     await this.Search_cat()
            // }
            // else {
            //     await this.TodaySearch()
            // }
            // this.totalPage()
            // this.searchResults = await this.search()

        },

        totalPage: function() {
            return Math.ceil(this.numHits / this.itemCounts);
        },
        rec_totalPage: function() {
            return Math.ceil(this.rec_numHits / this.itemCounts);
        },
        async first_TodaySearch_term() {
            $('.cat_btn_disabled').attr("disabled", true); //關閉類別選項
            this.display_Number_of_searches();
            this.hide_searches_cat();
            // this.searchTermFlag = 1;
            this.currPage = 1;

            // this.isActive = null;//把類別清除
            // 每次搜尋跳回第一頁
            this.searchOffset = 0
            await this.TodaySearch_term()
            $('.cat_btn_disabled').attr("disabled", false); //開啟類別選項
        },

    }
});
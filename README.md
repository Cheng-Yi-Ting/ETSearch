# DEMO

![image](https://github.com/Cheng-Yi-Ting/ETSearch/blob/master/demo-images/系統操作影片.gif)

## 說明

**影片中，透過操作兩位不同的使用者來進行系統呈現：
第一名使用者已有一些瀏覽及評分紀錄。
第二名使用者沒有任何的瀏覽及評分紀錄。**

## 第一名使用者

1. **系統登入**。此使用者已有一些瀏覽及評分紀錄。

2. **使用者登入後會跳轉至系統首頁**。在首頁可以看到新聞區塊，以及該名使用者是否有對新聞評分。

3. 若無點擊任何類別，列出「本日」最熱門的十個關鍵字為：冠軍、總統、溫網、蔡英文、國民黨、初選、民進黨、沙田、滿貫、郭台銘。

4. **使用者點擊「政治」類別**。列出本日「政治」最熱門的十個熱門關鍵字為：總統、蔡英文、國民黨、初選、民進黨、郭台銘、聖克里斯多福、選民、韓國瑜、民調。

5. **使用者點擊「聖克里斯多福」**。針對新聞標題及內文進行全文搜尋，列出「政治」類別含有「聖克里斯多福」的新聞文章，搜尋結果為 54 筆。新聞文章依照日期及時間進行排序，由新至舊。

6. **使用者點擊「第三篇」新聞**。顯示「新聞資訊區塊」，列出此篇新聞的十筆關鍵字。

7. **使用者對新聞進行評分**。可根據新聞的「可信程度」、「興趣程度」、「關鍵字詞」來進行評分。

8. **使用者點擊「相關新聞區塊」內的一篇新聞**後，將「新聞資訊區塊」關閉。

9. **使用者點擊「推薦」頁面**。因為該名使用者瀏覽及評分的文章多為「政治」類新聞，所以推薦的結果多為「政治」相關。

10. **使用者點擊「會員」頁面**。列出使用者目前的新聞瀏覽記錄，以使用者點擊新聞的時間點進行排序，較晚觀看的新聞優先顯示。最上面兩篇新聞為剛才使用者所點擊的新聞，而使用者有對「林飛帆接民進檔副秘 蔡英文歡迎正面看待」這篇新聞評分，所以該篇新聞標示為「已評分」。

11. **使用者點擊「政治」類**。列出目前瀏覽過的政治類新聞，當新聞為雙類別標籤時，匹配到其中任一個類別均可顯示。

## 第二名使用者

1. **註冊一名全新的使用者**。該名使用者沒有任何的瀏覽及評分紀錄。

2. **使用者註冊完成後跳轉至系統首頁。**

3. **使用者點擊「熱門」類**。可以觀察到第一頁的新聞多圍繞在MLB。

4. **使用者點擊「第一篇」新聞。**

5. **使用者對新聞進行評分**。完成後將「新聞資訊區塊」關閉。

6. **使用者點選下一頁**。繼續瀏覽第二頁熱門新聞。

7. 2019年7月舉辦溫布頓網球錦標賽以及國民黨總統初選，所以新聞多圍繞在此相關事件。

8. **使用者點擊「第一篇」新聞。**

9. **使用者對新聞進行評分**。完成後將「新聞資訊區塊」關閉。

10. **使用者點擊「推薦」頁面**。因為使用者評分兩篇新聞，第一篇是「棒球」新聞、第二篇是「網球」新聞，所以會推薦「棒球」和「網球」相關新聞。由於較新的新聞可能會沒有使用者瀏覽或評分，所以會透過類別隨機的方式，推薦出體育類別內的其他新聞，例如：籃球新聞。

# 系統說明

## 主頁面

![image](https://github.com/Cheng-Yi-Ting/ETSearch/blob/master/demo-images/1.png)

在主頁面的部分可分為**A、B、C、D、E、F、G**七個區塊，以下針對各區塊進行說明：

**A.  導覽列**，可連結至首頁、登入、註冊頁面，若使用者登入後，則顯示為首頁、推薦、會員、登出。

**B.  新聞搜尋區塊**，使用者於首頁搜尋新聞時，有以下兩種搜尋方式：

1. **無點選類別時輸入關鍵字：搜尋所有類別新聞。**

2. **點選類別時輸入關鍵字：搜尋特定類別新聞。**

**C.  搜尋結果區塊**，顯示於哪個類別進行搜尋，以及搜尋結果資料筆數。

**D.  新聞類別區塊**，共有十三個類別，有以下兩種方式：

1. **無點選類別：列出所有類別新聞。**

2. **點選類別：列出特定類別新聞。**

**E.  新聞資訊區塊**，每頁列出四十筆新聞，**顯示新聞圖像、描述、未評分或已評分、類別、日期及時間資訊**，描述是幫助使用者快速掌握新聞重點，可透過點擊新聞來進一步瀏覽新聞詳細資訊，並將點擊新聞行為數據用於基於內容式過濾及類別偏好推薦，新聞右上角圖示可連結到該篇新聞來源網站。

F. 列出當日新聞所有**熱門關鍵字或特定類別熱門關鍵字**，點擊後可針對該字詞進行搜尋。每次顯示十筆熱門關鍵字，最多一百筆，共十頁。

G. 列出目前頁數及總頁數。

## 登入、註冊頁面

登入及註冊頁面：使用者可以在登入頁面進行帳號登入、註冊頁面進行帳號註冊，當註冊成功後會直接登入系統。

![image](https://github.com/Cheng-Yi-Ting/ETSearch/blob/master/demo-images/2.png)
![image](https://github.com/Cheng-Yi-Ting/ETSearch/blob/master/demo-images/3.png)

## 新聞詳細資訊

![image](https://github.com/Cheng-Yi-Ting/ETSearch/blob/master/demo-images/4.png)

點擊新聞後可以觀看更詳細的新聞資訊，此部分可分為**A、B、C、D、E、F**六個區塊，以下針對各區塊進行說明：

**A.  新聞標題區塊**，顯示新聞標題。

**B.  新聞內容區塊**，顯示新聞內容。

**C.  新聞關鍵字區塊**，列出**十筆新聞關鍵字**，幫助使用者快速瞭解新聞主題。

**D.  新聞評分區塊**，共分為三個項目，每部分為一至五分，每篇新聞可以重複評分及取消評分，而最終評分結果為三個部分取均數。待使用者完成所有項目評分後將儲存評分紀錄，並將新聞資訊由未評分設為已評分。使用者評分將列為協同過濾推薦依據。

E.  相關新聞區塊，列出**最相關此篇新聞的四篇新聞**，點擊後可繼續瀏覽新聞。

F. 點擊後關閉新聞。

## 會員頁面

在會員頁面可以觀看使用者目前的新聞瀏覽記錄，以使用者點擊新聞的時間點進行排序，較晚觀看的新聞優先顯示，而使用者已看過的新聞不會重複記錄。使用者可透過點選類別區塊來瀏覽特定類別下的新聞，當新聞為雙類別標籤時，匹配到其中任一個類別均可顯示。

![image](https://github.com/Cheng-Yi-Ting/ETSearch/blob/master/demo-images/5.png)

## 推薦頁面

推薦頁面的結果為混合三種推薦方法，分別為協同過濾、基於內容式過濾及使用者類別偏好，範例為使用者偏好政治相關新聞的推薦結果，呈現前四筆。
![image](https://github.com/Cheng-Yi-Ting/ETSearch/blob/master/demo-images/6.png)

# 測試環境

本系統及分類器均建置於Linux平台，新聞爬取、文件分類器、使用者推薦均設定於crontab工作排程，打造一個全自動化的新聞推薦系統。

- 系統：Ubuntu 16.04.6 LTS

- CPU：Intel Xeon E5-2620 v4

- GPU：NVIDIA GeForce GTX 1080 Ti

- RAM：256G

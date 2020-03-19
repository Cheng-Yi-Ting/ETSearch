
import os
import re
import requests
import codecs
import sys
import json
import argparse
import time
from datetime import datetime,timedelta
from datetime import date
import datetime
from collections import deque
from pymongo import MongoClient


# -----mongodb-----
client = MongoClient()
client = MongoClient("mongodb://localhost:27017/")  # 建立连接：
db = client.News  # 指定将要进行操作的database
collection = db.day_popkeywords  # 指定将要进行操作的collection



def read_file(path, type):
    # file.read([size])从文件读取指定的字节数，如果未给定或为负则读取所有。
    if type == 'json':
        with open(path, 'r', encoding='utf-8') as file:
            data = json.loads(file.read())
    elif type == 'txt':
        with open(path, 'r', encoding='utf-8') as file:
            data = file.read()
    return data


# categories = ['3C', '遊戲', '時尚', '地產', '國際', '社會', '財經', '旅遊', '政治', '健康', '地方', '影劇', '體育', '生活', '寵物', '大陸','全部']
categories = ['生活', '旅遊', '社會', '國際', '地方', '健康', '體育', '影劇', '財經', '大陸', '寵物', '政治','全部']

TODAY=str(date.today())
filename = 'NewsCat.json'
DIR_NAME = "news"
# OUTPUT_DIR = os.path.join(os.path.split(os.path.realpath(__file__))[0], DIR_NAME)
path='../'+DIR_NAME+'/'+filename
docs = read_file(path, 'json')

# bulkOps = {
#     'date': YTD,
#     'category': category
# }
Life=docs.get(categories[0])
Tourism=docs.get(categories[1])
Society=docs.get(categories[2])
International=docs.get(categories[3])
Local=docs.get(categories[4])
Health=docs.get(categories[5])
Sports=docs.get(categories[6])
Entertainment=docs.get(categories[7])
Finance=docs.get(categories[8])
China=docs.get(categories[9])
Pet=docs.get(categories[10])
Political=docs.get(categories[11])
All=docs.get(categories[12])
    
pop_cat={
    categories[0]: Life,
    categories[1]: Tourism,
    categories[2]: Society,
    categories[3]: International,
    categories[4]: Local,
    categories[5]: Health,
    categories[6]: Sports,
    categories[7]: Entertainment,
    categories[8]: Finance,
    categories[9]: China,
    categories[10]: Pet,
    categories[11]: Political,
    categories[12]: All
}
bulkOps = {
    'date': TODAY,
    'pop_cat':pop_cat
}
bulk_body={
    categories[0]: Life,
    categories[1]: Tourism,
    categories[2]: Society,
    categories[3]: International,
    categories[4]: Local,
    categories[5]: Health,
    categories[6]: Sports,
    categories[7]: Entertainment,
    categories[8]: Finance,
    categories[9]: China,
    categories[10]: Pet,
    categories[11]: Political,
    categories[12]: All,
}
# for doc in docs:
#     # print(doc)
#     print(docs.get(doc))

# is_exist = collection.find_one(
#     {"date": YTD})
# if not is_exist:
#     # print(bulkOps)

# collection.drop()
# collection.insert_one(bulkOps)
# is_exist=0
# myquery = { "date": TODAY  }
# mydoc = collection.find(myquery)
# for x in mydoc:
#     print(x)
#     is_exist=1

# if is_exist==0:
#     collection.insert_one(bulkOps)
# else:
    # myquery = { "date": TODAY  }
    # newvalues = { "$set": { "pop_cat":pop_cat} }
    # collection.update_one(myquery, newvalues)


#!/usr/bin/python
# -*- coding:utf-8 -*-

# import filteringdata
import os
from math import sqrt
import sys, getopt
import math
import csv
import operator
import numpy as np
from numpy import genfromtxt, savetxt
from datetime import datetime,timedelta
from datetime import date
import random
import datetime
from sys import argv
from elasticsearch import Elasticsearch
from pymongo import MongoClient

# -----mongodb-----
client = MongoClient()
client = MongoClient("mongodb://localhost:27017/")  # 建立连接：
db = client.News  # 指定将要进行操作的database
collection = db.users  # 指定将要进行操作的collection

rec_news_list=[]
user_url_list=[]
url_dict=dict()

# cbf_based=[]
# cf_based=[]
# cat_based=[]
# 讀取使用者瀏覽新聞
def get_user(username):
    # 讀取使用者瀏覽過的新聞url
    is_exist = collection.find_one(
        {"name": username})
        


    for url in is_exist['viewNews']:
        user_url_list.append(url)

    print("viewNews")
    print(len(user_url_list))
    # for url in is_exist['content_based']:
    #     if url not in user_url_list and (url not in rec_news_list):
    #         rec_news_list.append(url)
    cbf_based=[]
    cf_based=[]
    cat_based=[]

    for url in is_exist['content_based']:
        # cbf_based.append(url)
        if url not in user_url_list :
            cbf_based.append(url)
            

    for url in is_exist['user_based']:
        # cbf_based.append(url)
        if url not in user_url_list:
            cf_based.append(url)
    
    for url in is_exist['cat_based']:
        # cat_based.append(url)
        if url not in user_url_list:
            cat_based.append(url)

    print("cbf_based")
    print(len(cbf_based))
    print("cf_based")
    print(len(cf_based))
    print("cat_based")
    print(len(cat_based))


    # if len(cf_based)<5:
    #     cf_based=cf_based[0:2]
    #     cbf_based=cbf_based[0:6]
    #     cat_based=cat_based[0:4]

    # elif len(cbf_based)<4:
    #     cf_based=cf_based[0:6]
    #     cbf_based=cbf_based[0:3]
    #     cat_based=cat_based[0:3]

    # elif len(cbf_based)<5 and len(cbf_based)<4:
    #     cat_based=cat_based[0:12]
    
    # else:
    #     cf_based=cf_based[0:5]
    #     cbf_based=cbf_based[0:4]
    #     cat_based=cat_based[0:3]

    cat_based=cat_based[0:6]
    # cf_based=cf_based[0:6]
    cbf_based=cbf_based[0:6]
    # print(len(cbf_based))
    # print(len(cf_based))
    # print(len(cat_based))

    # rec_news_list.extend(cf_based)
    rec_news_list.extend(cbf_based)
    rec_news_list.extend(cat_based)

    print("rec_news_list")
    print(rec_news_list)

def fech_NewsUrl(url):

    ELASTICSEARCH_IP='http://localhost:9200'
    es = Elasticsearch(hosts=[ELASTICSEARCH_IP]) # ELASTICSEARCH_IP is the 
    es_index='information'
    es_type='news'
    # news_list=[]
    # 取得該日新聞總數
    res= es.search(index=es_index,doc_type=es_type,body={
        "query": {
            "bool": {
                "must": { "match": { "url": url} },
            }
        }
    })
    for hit in res['hits']['hits']:
        url_dict[url]=hit['_source']['date']
    #     url_vectors_dict[hit['_source']['url']]=hit['_source']['vectors']
    # return url_vectors_dict



def main(argv):

    username = ''

    usage = 'usage: python tfiwf.py -i <iwffile> -d <document> -t <topK>'
    if len(argv) < 2:
        print(usage)
        sys.exit()
    try:
        # opts, args = getopt.getopt(argv,"hi:d:t:",
        #     ["iwffile=","document=", "topK="])
         opts, args = getopt.getopt(argv,"-h-u:",["help","username="])
        #  $python tfiwf.py -i iwf.txt -d test.txt -t 20
        # opts= [('-i', 'iwf.txt'), ('-d', 'test.txt'), ('-t', '20')]
    except getopt.GetoptError:
        print(usage)
        sys.exit(2)

    for opt, arg in opts:   # parsing arguments
        if opt == '-h':
            print(usage)
            sys.exit()
        elif opt in ("-u", "--username"):
            username = str(arg)
  
    get_user(username)
    # print(len(rec_news_list))
    # # print(rec_result)

    random.shuffle(rec_news_list)

    for i in rec_news_list[0:12]:
        fech_NewsUrl(i)
    
    # # # print('---------------')
    # # # print(url_dict)
    sorted_cnews = sorted(url_dict.items(), key=operator.itemgetter(1),reverse=True)#排序(輸出字和權重)

    rec_list=[]
    for news_url in sorted_cnews:
        rec_list.append(news_url[0])
    # print('-------------------------')
    print(len(rec_list))



    user = { "name": username }
    news_values = { "$set": { "user_rec": rec_list } }
    collection.update_one(user,news_values)

 
 
    # print(x)
if __name__ == "__main__":
    main(sys.argv[1:])
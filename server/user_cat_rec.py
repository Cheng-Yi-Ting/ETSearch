#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import re
import requests
import codecs
import sys, getopt
import sys
import json
import argparse
import time
import math
from datetime import datetime,timedelta
from datetime import date
import datetime
import random
from collections import deque
from pymongo import MongoClient
from elasticsearch import Elasticsearch
import operator

# -----mongodb-----
client = MongoClient()
client = MongoClient("mongodb://localhost:27017/")  # 建立连接：
db = client.News  # 指定将要进行操作的database
collection = db.users  # 指定将要进行操作的collection

url_list=[]
user_url_list=[]
url_dict=dict()

# 讀取使用者瀏覽新聞
def get_users_and_rec_news(username,cat):
    # 讀取使用者瀏覽過的新聞url
    is_exist = collection.find_one(
        {"name": username})
        


    for url in is_exist['viewNews']:
        user_url_list.append(url)

    # two cat news
    if len(cat)>2:
        catOne=cat[0:2]
        catTwo=cat[2:4]
        is_exist['cat_stat'][catOne]+=1
        is_exist['cat_stat'][catTwo]+=1

    # one cat news
    else:
        is_exist['cat_stat'][cat]+=1
    
    # print(is_exist['cat_stat'])

    # change and store to mongodb
    user = { "name": username }
    news_values = { "$set": { "cat_stat": is_exist['cat_stat'] } }
    collection.update_one(user,news_values)

    Is_exist = collection.find_one(
        {"name": username})
        
    # print(Is_exist['cat_stat'])

    # find max count cat
    max_cat_count=max(Is_exist['cat_stat'].values())
    user_cat=[]


    for key,value in Is_exist['cat_stat'].items():
        if value ==max_cat_count:
            user_cat.append(key)
            
    fech_Newscat(user_cat)


def fech_Newscat(user_cat):

    ELASTICSEARCH_IP='http://localhost:9200'
    es = Elasticsearch(hosts=[ELASTICSEARCH_IP]) # ELASTICSEARCH_IP is the 
    es_index='information'
    es_type='news'

    today = datetime.date.today()
    # today='2019-07-06'
    # news_list=[]
    # 取得該日新聞總數
  
    for i in range(len(user_cat)):
        res= es.search(index=es_index,doc_type=es_type,body={
                "query": {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "date": today
                                }
                            },
                            {
                                "term": {
                                    "category": user_cat[i]
                                }
                            }
                        ]

                    }
                },
        })
        total=res['hits']['total']
        # print(total)

        res= es.search(index=es_index,doc_type=es_type,body={
            "from" : 0, "size" : total,
                "query": {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "date": today
                                }
                            },
                            {
                                "term": {
                                    "category": user_cat[i]
                                }
                            }
                        ]

                    }
                },
        })
        for hit in res['hits']['hits']:
            if hit['_source']['url'] not in user_url_list:
                url_list.append(hit['_source']['url'])
    #     url_dict[url]=hit['_source']['date']
    #     url_vectors_dict[hit['_source']['url']]=hit['_source']['vectors']
    # return url_vectors_dict
    # print(len(url_list))
    


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


def main(argv):


    targetUrl = ''
    username = ''
    topK = None

    usage = 'usage: python tfiwf.py -i <iwffile> -d <document> -t <topK>'
    if len(argv) < 4:
        print(usage)
        sys.exit()
    try:
        # opts, args = getopt.getopt(argv,"hi:d:t:",
        #     ["iwffile=","document=", "topK="])
         opts, args = getopt.getopt(argv,"-h-c:-u:",["help","cat=","username="])
        #  $python tfiwf.py -i iwf.txt -d test.txt -t 20
        # opts= [('-i', 'iwf.txt'), ('-d', 'test.txt'), ('-t', '20')]
    except getopt.GetoptError:
        print(usage)
        sys.exit(2)

    for opt, arg in opts:   # parsing arguments
        if opt == '-h':
            print(usage)
            sys.exit()
        elif opt in ("-c", "--cat"):
            cat = str(arg)
        elif opt in ("-u", "--username"):
            username = str(arg)


   
    # print(cat)
    # print(username)



    # print('---------------')
    get_users_and_rec_news(username,cat)
    rec_list=url_list[0:12]
    # random.shuffle(url_list)

    # for i in url_list[0:12]:
    #     fech_NewsUrl(i)


    # sorted_cnews = sorted(url_dict.items(), key=operator.itemgetter(1),reverse=True)#排序(輸出字和權重)

    # rec_list=[]
    # for news_url in sorted_cnews:
    #     rec_list.append(news_url[0])
    # # print('-------------------------')
    print(len(rec_list))

    user = { "name": username }
    news_values = { "$set": { "cat_based": rec_list } }
    collection.update_one(user,news_values)
 



if __name__ == "__main__":
    main(sys.argv[1:])

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

collection_news_group=db.news_group

user_url_list=[]
rec_news_list=[]
sim_list=[]
url_dict=dict()

# 讀取使用者瀏覽新聞
def get_users_and_rec_news(username):
    # 讀取使用者瀏覽過的新聞url
    is_exist = collection.find_one(
        {"name": username})
        
    for url in is_exist['viewNews']:
        user_url_list.append(url)

    for url in is_exist['content_based']:
        if url not in user_url_list:
            rec_news_list.append(url)

# #get rec news
# def rec_news(username):
#     is_exist = collection.find_one(
#         {"name": username})
    
#     for url in is_exist['content_based']:
#         if url not in user_url_list:
#             rec_news_list.append(url)




# 讀取相關新聞
def fetch_sim(url):
    cnt=0
    is_exist = collection_news_group.find_one(
    {"news": url})

    global sim_list
    for i in is_exist['group_news']:
        cnt+=1
        if (i not in rec_news_list) and  (i not in user_url_list):
            # cnt+=1
            sim_list.append(i)
            # if cnt==10:
            #     break

# # 讀取相關新聞
# def fetch_sim(url):

#     news_list=[]


#     is_exist = collection_news_group.find_one(
#     {"news": url})

#     for i in is_exist['group_news']:
#         # 使用者未瀏覽過
#         if i not in user_url_list:
#             news_list.append(i)

#         # print(is_exist['group_news'])
#     # 歷史新聞的相關新聞(未瀏覽過)
#     # print(news_list)
#     return news_list
#         # url_list.append(url)
#     # 讀取新聞content
#     # return url_list

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

    global sim_list
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
         opts, args = getopt.getopt(argv,"-h-i:-u:",["help","targetUrl=","username="])
        #  $python tfiwf.py -i iwf.txt -d test.txt -t 20
        # opts= [('-i', 'iwf.txt'), ('-d', 'test.txt'), ('-t', '20')]
    except getopt.GetoptError:
        print(usage)
        sys.exit(2)

    for opt, arg in opts:   # parsing arguments
        if opt == '-h':
            print(usage)
            sys.exit()
        elif opt in ("-i", "--targetUrl"):
            targetUrl = str(arg)
        elif opt in ("-u", "--username"):
            username = str(arg)


   
    # print(targetUrl)
            
    # print(username)
    

    # print('---------------')
    get_users_and_rec_news(username)
    # print(len(user_url_list))
    # print(len(rec_news_list))
    fetch_sim(targetUrl)



    random.shuffle(sim_list)
    sim_list=sim_list[0:2]

    random.shuffle(rec_news_list)

    sim_list.extend(rec_news_list)
    # print(len(rec_news_list))
    # print(len(sim_list))

    rec_list=sim_list[0:40]
    
    print(len(rec_list))
    # random.shuffle(rec_news_list)

    # for i in rec_news_list[0:6]:
    #     fech_NewsUrl(i)

    # # # print('---------------')
    # # # print(url_dict)
    # sorted_cnews = sorted(url_dict.items(), key=operator.itemgetter(1),reverse=True)#排序(輸出字和權重)

    # rec_list=[]
    # for news_url in sorted_cnews:
    #     rec_list.append(news_url[0])
    # # print('-------------------------')
    # print(len(rec_list))

    user = { "name": username }
    news_values = { "$set": { "content_based": rec_list } }
    collection.update_one(user,news_values)
 



if __name__ == "__main__":
    main(sys.argv[1:])

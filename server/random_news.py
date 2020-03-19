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
import datetime
import random
from sys import argv
from elasticsearch import Elasticsearch
from pymongo import MongoClient


url_dict=dict()


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
        if len(url_dict)==10:
            break
        url_dict[url]=hit['_source']['date']
    #     url_vectors_dict[hit['_source']['url']]=hit['_source']['vectors']
    # return url_vectors_dict



def main(argv):
    # -----mongodb-----
    client = MongoClient()
    client = MongoClient("mongodb://localhost:27017/")  # 建立连接：
    db = client.todayNews  # 指定将要进行操作的database
    collection = db.news  # 指定将要进行操作的collection

    Today_list=[]
    for news in collection.find():
        Today_list.append(news["url"])
    # Today_list.append("https://udn.com/news/story/13013/3906295")
    # Today_list.append("https://udn.com/news/story/7240/3906293")
    print(len(Today_list))
    random.shuffle(Today_list)

    for i in Today_list:
        fech_NewsUrl(i)
    
    sorted_cnews = sorted(url_dict.items(), key=operator.itemgetter(1),reverse=True)#排序(輸出字和權重)
    rec_list=[]
    for news_url in sorted_cnews:
        rec_list.append(news_url[0])
    # print('-------------------------')
    print(len(rec_list))

    # user = { "name": username }
    # news_values = { "$set": { "random_news": rec_list } }
    # collection.update_one(user,news_values)

    db = client.News  # 指定将要进行操作的database
    collection_random_news = db.random_news  # 指定将要进行操作的collection

    bulkOps = {
    'news':rec_list
    } 
    # collection.insert_one(rec_list)
    collection_random_news.drop()
    # print(bulkOps)
    collection_random_news.insert_one(bulkOps)


    # print(x)
if __name__ == "__main__":
    main(sys.argv[1:])
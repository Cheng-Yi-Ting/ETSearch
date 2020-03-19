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
from sys import argv
from elasticsearch import Elasticsearch
from pymongo import MongoClient

# -----mongodb-----
client = MongoClient()
client = MongoClient("mongodb://localhost:27017/")  # 建立连接：
db = client.News  # 指定将要进行操作的database
collection = db.users  # 指定将要进行操作的collection

all_critics=dict()
user_url_list=[]
url_dict=dict()

# 讀取使用者瀏覽新聞
def get_users_view(username):
    # 讀取使用者瀏覽過的新聞url
    is_exist = collection.find_one(
        {"name": username})
        
    for url in is_exist['viewNews']:
        user_url_list.append(url)


for user in collection.find():
    user_critics=dict()
    for item in user['rating']:
        url=item['url']
        avg_score=item['score'][0]
        # parse a string to a float
        avg_score=float(avg_score)
        user_critics[url]=avg_score

    all_critics[user['name']]=user_critics 
print(all_critics)
    
# test data
# A dictionary of movie critics and their ratings of a small
# set of movies
# critics = {'Lisa Rose': {'Lady in the Water': 2.5, 'Snakes on a Plane':3.5,
# 'Just My Luck': 3.0, 'Superman Returns': 3.5, 'You, Me and Dupree': 2.5, 
# 'The Night Listener': 3.0},
# 'Gene Seymour': {'Lady in the Water': 3.0, 'Snakes on a Plane': 3.5, 
# 'Just My Luck': 1.5, 'Superman Returns': 5.0, 'The Night Listener': 3.0,
# 'You, Me and Dupree': 3.5},
# 'Michael Phillips': {'Lady in the Water': 2.5, 'Snakes on a Plane': 3.0, 
# 'Superman Returns': 4.0, 'The Night Listener': 4.0},
# 'Claudia Puig': {'Snakes on a Plane': 3.5, 'Just My Luck': 3.0, 'The Night Listener': 4.5, 'Superman Returns': 4.0, 'The Night Listener': 3.0,
# 'You, Me and Dupree': 2.5},
# 'Mick LaSalle': {'Lady in the Water': 3.0, 'Snakes on a Plane': 4.0, 
# 'Just My Luck': 2.0, 'Superman Returns': 3.0, 'The Night Listener': 3.0,
# 'You, Me and Dupree': 2.0},
# 'Jack Matthews': {'Lady in the Water': 3.0, 'Snakes on a Plane': 4.0, 
# 'Superman Returns': 5.0, 'The Night Listener': 3.0,
# 'You, Me and Dupree': 3.5},
# 'Toby': {'Snakes on a Plane': 4.5,'Superman Returns': 4.0,
# 'You, Me and Dupree': 4.0},
# }

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


# def cosine_similarity(v1, v2):
#         # compute cosine similarity of v1 to v2: (v1 dot v2)/{||v1||*||v2||)
#     sum_xx, sum_xy, sum_yy = 0.0, 0.0, 0.0
#     for i in range(0, len(v1)):
#         x, y = v1[i], v2[i]
#         sum_xx += math.pow(x, 2)
#         sum_yy += math.pow(y, 2)
#         sum_xy += x * y
#     try:
#         return sum_xy / math.sqrt(sum_xx * sum_yy)
#     except ZeroDivisionError:
#         return 0

# # 
# def sim_distance(prefs, person1, person2):
#     # 獲取雙方評分共同的項目
#     # Get the list of shared items
#     sim = {}
#     for item in prefs[person1]:
#         if item in prefs[person2]:
#             sim[item] = 1

#     sum_of_squares=0.0
#     # If they have no ratings in common, return zero
#     if len(sim) == 0:
#         return 0

#     # 歐氏距離(Euclidean Distance)，距離越小，相似度越高
#     for item in prefs[person1]:
#         if item in prefs[person2]:
#             x=prefs[person1][item]-prefs[person2][item]
#             sum_of_squares += math.pow(x, 2)

#     return 1/ (1 + sum_of_squares)

# # Returns the Pearson correlation coefficient  for person1 and person2
# def sim_pearson(prefs, person1, person2):
# 	# Get the list of mutually rated items
# 	si = {}
# 	for item in prefs[person1]:
# 		if item in prefs[person2]: si[item] = 1

# 	# Find the number of elements
# 	n = len(si)

# 	# If they are no ratings in common, return zeron
# 	if n == 0: return 0

# 	# Add up all the preferences
# 	sum1 = sum([prefs[person1][it] for it in si])
# 	sum2 = sum([prefs[person2][it] for it in si])

# 	# Sum up the Sqares
# 	sum1Sq = sum([pow(prefs[person1][it],2) for it in si])
# 	sum2Sq = sum([pow(prefs[person2][it],2) for it in si])

# 	# Sum up the products
# 	pSum = sum([prefs[person1][it]*prefs[person2][it] for it in si])

# 	# Calculat the Pearson score
# 	num = pSum - (sum1*sum2/n)
# 	den = sqrt((sum1Sq -pow(sum1, 2)/n)*(sum2Sq - pow(sum2, 2)/n))
# 	if den == 0: return 0

# 	r = num/den
# 	return r

# Calculating Cosine Similarity 
def compute_cosine_similarity(ratings, user_1, user_2):
    # 獲取雙方評分共同的項目
    # Get the list of shared items
    sim = {}
    for item in ratings[user_1]:
        if item in ratings[user_2]:
            sim[item] = 1


    # If they have no ratings in common, return zero
    if len(sim) == 0:
        return 0
    # user_1 array
    userOneRatingsArray=[]
    for item in sim:
        userOneRatingsArray.append(ratings[user_1][item])
    # print(sim)
    # print(userOneRatingsArray)
    # userOneRatingsArray = map(int, userOneRatingsArray)
     # user_2 array
    userTwoRatingsArray=[]
    for item in sim:
        userTwoRatingsArray.append(ratings[user_2][item])
    # print(ratings[user_1])
    # print(ratings[user_2])
    # print(sim)
    # print(userOneRatingsArray)
    # print(userTwoRatingsArray)

    # compute_cosine_similarity
    sum_xx, sum_yy, sum_xy = 0.0,0.0,0.0

    for i in range(len(userOneRatingsArray)):
        
        x = userOneRatingsArray[i]
        y = userTwoRatingsArray[i]
        
        sum_xx += x*x
        sum_yy += y*y
        sum_xy += x*y

    # print(sum_xy/math.sqrt(sum_xx*sum_yy))
    try:
        return sum_xy/math.sqrt(sum_xx*sum_yy)
    except ZeroDivisionError:
        return 0


# # Returns the best matches for person from the prefs dictionary.
# def topMatches(prefs, person, n=5, similarity=compute_cosine_similarity):

#     scores={}
#     for other in prefs:
#         if other!=person:
#             sim=similarity(prefs, person, other)
#             scores[other]=sim

#     # scores = [(similarity(prefs, person, other),other) for other in prefs if other!=person]
#     # print(scores)
#     scores = sorted(scores.items(), key=operator.itemgetter(1),reverse=True)#排
#     # print(scores)
#     # Sort the list so the highest scores appear at the top\
#     # scores.sort()
#     # scores.reverse()
#     return scores[0:n]


'''
User-based Collaborative Filtering Weighted
給定一個用戶 A
計算用戶 A 跟其他所有用戶的相似度
找出最相似的 m 個用戶
再找出這些用戶有評分但是用戶 A 沒有評分的物品（也可以額外限制至少要幾個用戶有評分過）
以「相似用戶的相似度」和「該用戶對該物品的評分」來加權算出用戶 A 對這些未評分物品的評分
最後推薦給 A 評分最高的 n 個物品


'''
# Gets recommendations for a person by using a weighted average
# of every other user's rankings
def getRecommendations(prefs, person, similarity=compute_cosine_similarity):
    totals = {}
    simSums = {}
    for other in prefs:
        # don't compare me to myself
        print(other)
        # if other == person: continue
        sim = similarity(prefs, person, other)
        print(sim)
        # ignores scores of 0.6 or lower
        # if sim <= 0: continue
        # if sim <= 0.6: continue
        # print(other)
        # print(sim)
        # print(sim)

        for item in prefs[other]:
            # only score movies I haven't seen yet
            #  Ignore if this user has already rated this item
            if (item not in prefs[person]) and  (item not in user_url_list):
            # if item not in prefs[person]:
                # Similarity * score
                # 第一次先設該項目為0
                # Weighted sum of rating times similarity
                # print(sim)
                totals.setdefault(item, 0)
                # print(totals)
                # totals[item]=該使用者的評分*和該使用者的相似度
                totals[item]+=prefs[other][item]*sim
                # print(prefs[other][item])
                # print(totals)
                # 第一次先設該項目為0
                 # Sum of all the similarities
                # Sum of similarities
                simSums.setdefault(item, 0)
                # simSums[item]=和該使用者的相似度
                simSums[item]+=sim
                # print(simSums)
                # print(simSums)

    # Create the normalized list
    #  Divide each total score by total weighting to get an average
    rankings=[]
    for item, total in totals.items():

        rating=totals[item]/simSums[item]
        # if(rating>3.5):
        #     rankings.append((rating,item))
        # rankings=total/simSums[item]
        # print(rankings)
        # total/simSums[item]
    # 同上
    # rankings = [(total/simSums[item],item) for item, total in totals.items()]
    # print(rankings)
    # Returns the sorted list
     # Return the rankings from highest to lowest
    rankings.sort()
    rankings.reverse()
    return rankings


def main(argv):
    # x=compute_cosine_similarity(critics,'Lisa Rose','Gene Seymour')
    # print(x)
    # print(topMatches(critics,'Toby',n=4))
    # x=getRecommendations(critics,'Toby')

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
    '''
    centering to mean的方式，所有的原始分數減去user的均數
    Adjusted-cosine 相似度計算會把每個 user 對 item 的 rating，扣掉 user 對所有有評分 item 的平均，目的是為了要把某個 user 對某個 item 評分的 bias 給去除。
    '''
    # print(username)
    # rec_result=getRecommendations(all_critics,'123')
    # print(rec_result)
    # for person in all_critics:
    #     sum_score=0
    #     cnt=0
    #     for item in all_critics[person]:
    #         sum_score+=all_critics[person][item]
    #         cnt+=1
  
    #     for item in all_critics[person]:
    #         all_critics[person][item]=all_critics[person][item]-round(sum_score/cnt,2)
    # print(username)
    # remove user seen news
    get_users_view(username)
    rec_result=getRecommendations(all_critics,username)
    # print(rec_result)
    for i in rec_result:
        fech_NewsUrl(i[1])
    
    # # print('---------------')
    # # print(url_dict)
    sorted_cnews = sorted(url_dict.items(), key=operator.itemgetter(1),reverse=True)#排序(輸出字和權重)

    rec_list=[]
    for news_url in sorted_cnews[0:200]:
        rec_list.append(news_url[0])
    # print('-------------------------')
    print(len(rec_list))

    user = { "name": username }
    news_values = { "$set": { "user_based": rec_list } }
    collection.update_one(user,news_values)

 
 
    # print(x)
if __name__ == "__main__":
    main(sys.argv[1:])
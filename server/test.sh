#!/bin/bash
#crontab -e :*/1 * * * * bash /home/test/data1/final/spider_script.sh
echo start spider
source /home/gais0/justice/data1/tensorflow/bin/activate
cd /home/gais0/justice/data1/ETSearch/server
python test.py



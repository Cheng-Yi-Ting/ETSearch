#!/bin/bash
echo start user rec
source /home/gais0/justice/data1/tensorflow/bin/activate
cd /home/gais0/justice/data1/ETSearch/server

# echo "Shell 传递参数实例！";
# echo "执行的文件名：$0";
# echo "第1个参数为：$1";
# echo "第2个参数为：$2";
# echo "第3个参数为：$3";
# echo "第4个参数为：$4";

python  user_rec.py $1 $2



from pymongo import MongoClient
from uuid import UUID
from db import Database
import json

db=Database()

a, b="test2_1", "b40396fc-0ada-4997-ac48-17a76ddde4cc"
c, d="test2_2", "a16c1b52-b2eb-4d75-a07a-ba6737d25a69"
e, f="test2_3", "ea5710ab-6daf-457c-beb7-153c4a90f2fc" 
g, h="Office_S", "a5b3327b-6905-461b-8c69-b9b0f922838d" 
files_arr=[{"name": e, "uuid": f},  {"name": a, "uuid": b}]

""" files_arr=[{"name": a, "uuid": b}]  """

# elems= db.intersection_types_in_files(files_arr)

elems= db.difference_types_in_files(files_arr)

""" 
a=[1,2,3]
b=[3,5]
c=[6,3,1]
d=[]
arr=[a,b,c]

x=[]
x+=a
x+=b
x+=c

y=[]
for e in x:
    t=0
    for i in range(0,len(arr)):
        if (e in arr[i]):
            t+=1
    if t == len(arr):
        y.append(e)

z=list(set(y))
print("common elements: ", z) """

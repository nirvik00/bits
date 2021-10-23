from pymongo import MongoClient
from uuid import UUID
from db import Database
import json

db=Database()

a, b="test2_1", "d57fbd36-f066-4618-b584-7487da7bceca"
c, d="test2_2", "b340705a-f7cb-4c9e-9da5-6a161e5bf9bb"
e, f="test2_3", "4d6fdd21-b2d8-4f58-be98-a035e5d84f2d" 
files_arr=[{"name": a, "uuid": b}, {"name": c, "uuid": d},{"name": e, "uuid": f}]

""" files_arr=[{"name": a, "uuid": b}]  """

elems= db.intersection_types_in_files(files_arr)
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

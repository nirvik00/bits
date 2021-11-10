from pymongo import MongoClient
from uuid import UUID
from db import Database
import json

db=Database()

a, b="test2_1", "010a7fca-941b-4ad9-813f-904a30eb5b74"
c, d="test2_2", "4026efba-6c89-4f29-849c-2e87082a881a"
e, f="test2_3", "c68f0a7e-d7d8-405f-9f26-aea120911a45" 
g, h="Office_A", "11a7073f-b078-4ff7-a137-708113c851be" 
files_arr=[{"name": e, "uuid": f},  {"name": a, "uuid": b}]

""" files_arr=[{"name": a, "uuid": b}]  """

# elems= db.intersection_types_in_files(files_arr)
# elems= db.difference_types_in_files(files_arr)

col=db.get_collection(a,b)
itr = col.find({})
for elem in itr:
    for k, v in elem.items():
        if k=="name":
            print(k, v)
        if k=="type":
            print(k, v)
        if k=="properties":
            for props in v:
                x=props.keys()
                for prop in x:
                    print(prop)


s="(wall and wall.length>2)"

# elems= db.query(col)


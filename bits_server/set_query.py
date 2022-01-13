from pymongo import MongoClient
from uuid import UUID
from db import Database
import json
import operator

def run_set_query(file_obj_arr):
    all_elems=[]
    all_docs=[]
    for e in file_obj_arr:
        try:
            collection= db.get_collection(e["name"], e["uuid"])
            docs=collection.find()
            for i in docs:
                all_elems.append(i["global_id"])
            all_docs.append(all_elems)
        except:
            pass
    #
    y=[]
    for e in all_elems:
        t=0
        if e in y:
            continue
        for i in range(0, len(all_docs)):
            if e in all_docs[i]:
                t+=1
        if t == len(all_docs):
            y.append(e)
    z=list(set(y))
    doc= db.get_collection(file_obj_arr[0]["name"], file_obj_arr[0]["uuid"])
    intx_elems=[]
    for e in z:
        r=doc.find_one({"global_id": e})
        try:
            elem={}
            elem["global_id"]=r["global_id"]
            elem["type"]=r["type"]
            elem["name"]=r["name"]
            elem["vertices"]=r["vertices"]
            elem["faces"]=r["faces"]
            elem["name"]=r["name"]
            elem["properties"]=r["properties"]
            # intx_elems.append(elem)
            intx_elems.append([elem["global_id"], elem["type"] ])
        except:
            pass
    
    intx_elems.sort(key=operator.itemgetter(1))

    for i in intx_elems:
        print(i)

    return intx_elems

db=Database()

file_obj_arr=[]
with open("set_query.json", "r") as f:
    file_obj_arr=json.load(f)

run_set_query(file_obj_arr)
"""
Created on Wed Oct  13 04:41:54 2021

@author: nirviksaha
"""

from pymongo import MongoClient
from uuid import UUID
import json

class Database(object):
    #
    # set up the db with name -  BITS
    def __init__(self):
        # self.u  = 'mongodb+srv://ns:Root@cluster0.3gu0o.mongodb.net/test'
        self.db_name="bits"
        self.u = "mongodb://localhost:27017"
        self.client = MongoClient(self.u, uuidRepresentation="standard")
        self.db = self.client[self.db_name]
        
    #   func 0
    #   general functions
    def general_functions(self, collection):
        one_docs=collection.find_one()
        print(one_docs)
        #
        # operation on all docs
        all_docs=collection.find({})
        for doc in all_docs:
            print(doc["type"])

    #   func 1
    #   get all dbs
    def list_databases(self):
        for db in self.client.list_databases():
            print(db)

    #   func 2
    #   get all the collections - ifc files in the db
    def list_collections(self):
        col=[]
        for i in self.db.list_collections():
            try:
                x=str(i["info"]["uuid"])
                t={"name": i["name"], "uuid":x}
                col.append(t)
            except:
                print("error:\n", i["name"])
        return col

    #   func 3
    #   upload a ifc-json file - add collection to db
    def write_json(self, col_name, arr):
        self.col = col_name
        for e in arr["data"]:
            t=json.loads(e)
            self.db[self.col].insert(t)

    #   func 4
    #   get collection from name and uuid 
    def get_collection(self, name, uuid):
        req_col=None #   this is the required collection
        for i in self.db.list_collections():
            if str(i["info"]["uuid"]) == str(uuid):
                req_col=self.db.get_collection(i["name"])
                break
        n=req_col.count_documents({}) # unnecessary
        return req_col
        
    #   func 5
    #   get distinct types in a collection from func -2
    def get_distinct_types_in_collection(self, collection):
        distinct_types=collection.distinct("type")
        distinct_types_obj = []
        for e in distinct_types:
            x={"type": e, "count": 0}
            distinct_types_obj.append(x)

        #all docs in a collection
        all_docs=collection.find({})
        #  count distinct types
        for doc in all_docs:
            for obj in distinct_types_obj:
                if  doc["type"] == obj["type"]:
                    obj["count"]=obj["count"]+1  
        
        return distinct_types_obj

    #   func 6
    #   get data of distinct types in a collection from func -2
    def get_type_data_from_collection(self, collection, typex):
        type_data=[]
        for i in collection.find({"type":typex}):
            fields= {}
            fields["global_id"]= i["global_id"]
            fields["type"]= i["type"]
            fields["vertices"]= i["vertices"]
            fields["faces"]= i["faces"]
            fields["name"]= i["name"]
            fields["props"]= i["props"]
            type_data.append(fields)
        return type_data

    #   func 7
    #   get union of distinct types in different files
    def union_types_in_files(self, file_obj_arr):
        all_elems=[]
        for e in file_obj_arr:
            collection= self.get_collection(e["name"], e["uuid"])
            docs=collection.find()
            for i in docs:
                all_elems.append(i)
        return all_elems

    #   func 8
    #   get intersection of distinct types in different files
    def intersection_types_in_files(self, file_obj_arr):
        all_elems=[]
        all_docs=[]
        for e in file_obj_arr:
            try:
                collection= self.get_collection(e["name"], e["uuid"])
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
        doc= self.get_collection(file_obj_arr[0]["name"], file_obj_arr[0]["uuid"])
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
                elem["props"]=r["props"]
                intx_elems.append(elem)
            except:
                print("\nerror")
        return intx_elems

    #   func 9
    #   get difference between A and others distinct types in different files
    def difference_types_in_files(self, file_obj_arr):
        types_arr2d=[]
        for e in file_obj_arr:
            collection= self.get_collection(e["name"], e["uuid"])
            types=self.get_distinct_types_in_collection(collection)
            name_arr=[]
            for f in types:
                name_arr.append(f["type"])
            types_arr2d.append(name_arr)
        #
        diff_arr=set(types_arr2d[0])
        for i in range(1, len(types_arr2d)-1):
            diff_arr= list(set.difference(set(diff_arr), set(types_arr2d[i])))
        #
        return diff_arr


    #   func 15
    #   run mongodb queries in python
    def query(self, collection):
        query={"type": "IfcWallStandardCase"}
        doc=collection.find(query)
        for i in doc:
            print(i)



"""
# DRIVER FUNCTION

a, b="fullHouse", "ebd9a5b1-addd-42db-a8f5-afba3cd59b24"
c, d="wall_door", "d3971ecb-ea00-42d6-90b4-a6eadc3dcf9d"
e, f="walls_doors_general", "eb5fbca0-bb15-4c11-82b4-8e069bb2ae63" 

db=Database()
col=db.get_collection(a, b) 
#   col_type_data=db.get_type_data_from_collection(col, "IfcWallStandardCase")
db.query(col)

"""
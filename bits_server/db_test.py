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


# elems= db.intersection_types_in_files(files_arr)
# elems= db.difference_types_in_files(files_arr)


#################################
#                               #
#       query functions         #
#                               #
#################################

def display_elem_query(cur, param_arr):
    for elem in cur:
        print("---------\nid: ", elem["_id"])
        prop_li=elem["properties"]
        for props in prop_li:
            for k,v in props.items():
                if k and v:
                    print(k,": ", v)
                    filter_params(k, v, param_arr)

def filter_params(k, v, param_arr):
    for param in param_arr:
        #print("param:", param)
        if k == param["property"]:
            print("checking...", k)
            range_t, match_t = False, False
            min_x, max_x, match_x = None, None, None
            try:
                if param["range"]:
                    min_x = float(param["range"][0])
                    max_x = float(param["range"][1])
                    try: 
                        v = float(v)
                        if v>min_x and v<max_x:
                            range_t = True
                    except:
                        range_t=True
                    print("test range: ", k, v, min_x, max_x, range_t)
            except:
                range_t=True
            

            try:
                if param["match"]:
                    match_x = str(param["match"])
                    try: 
                        v = str(v)
                        if v == match_x:
                            match_t = True
                    except:
                        match_t=True
                    print("test match: ", k, v, match_t)
            except:
                match_t=True
            


def run_query():
    with open ("query.json", "r") as f:
        input_json_li = json.load(f)

    req_data=[]
    for x_json in input_json_li:
        col=db.get_collection(x_json["filename"],x_json["uuid"])
        print("\nfilename: ", x_json["filename"], "\tuuid:", x_json["uuid"])
        query_arr=x_json["query"]
        for query in query_arr:
            elem_type = query["type"]
            param_arr=query["parameters"]
            s={}
            s["type"]=1
            s["name"]=1
            for param in param_arr:
                s["properties."+str(param["property"])]=1
            cur = col.find({"type":elem_type}, s)
            #print('\nnumber of records: ', len(list(cur)), '\n')
            display_elem_query(cur, param_arr)

            

# elems= db.query(col)

run_query()

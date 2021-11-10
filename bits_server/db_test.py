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

def elem_query(cur, param_arr, file_details):
    req_obj=[]
    for elem in cur:
        prop_li=elem["properties"]
        #print("-----element----\nid: ", elem["_id"])
        #print("\n")
        s={}
        s["db_id"]=str(elem["_id"])
        i,j=0,0
        for props in prop_li:
            for k,v in props.items():
                if k and v:
                    # print(k,": ", v)
                    s[k]=v
                    k=filter_params(k, v, param_arr)
                    #print(k)
                    if k==True:
                        j+=1
                    i+=1
        #print(s, i, j)
        if i==j:
            s["filename"] = file_details["filename"]
            s["collection_uuid"] = file_details["uuid"]
            s["global_id"]= elem["global_id"]
            s["type"]= elem["type"]
            s["name"]= elem["name"]
            req_obj.append(s)
    return req_obj

def filter_params(k, v, param_arr):
    for param in param_arr:
        if k == param["property"]:
            #print("checking...", k)
            range_t, match_t = False, False
            min_x, max_x, match_x = None, None, None

            try:
                if param["range"] and len(param["range"])>0:
                    min_x = float(param["range"][0])
                    max_x = float(param["range"][1])
                    v = float(v)
                    if v>min_x and v<max_x:
                        range_t = True
            except:
                range_t=True

            try:
                if param["match"]:
                    match_x = str(param["match"])
                    v = str(v)
                    if v == match_x:
                        match_t = True
            except:
                match_t=True

    if range_t==True and match_t == True:
        return True

    return False
            


def run_query():
    with open ("query.json", "r") as f:
        input_json_li = json.load(f)

    req_data=[]
    for x_json in input_json_li:
        col=db.get_collection(x_json["filename"],x_json["uuid"])
        #print("\nfilename: ", x_json["filename"], "\tuuid:", x_json["uuid"])
        file_details={"filename":x_json["filename"], "uuid": x_json["uuid"]}
        query_arr=x_json["query"]
        for query in query_arr:
            elem_type = query["type"]
            param_arr=query["parameters"]
            s={}
            s["global_id"]=1
            s["type"]=1
            s["name"]=1
            for param in param_arr:
                s["properties."+str(param["property"])]=1
            cur = col.find({"type":elem_type}, s)

            x=elem_query(cur, param_arr, file_details)
            #print(len(x))
            if len(x) > 0:
                for e in x:
                    req_data.append(e)

    print(json.dumps(req_data, indent=2))
            

# elems= db.query(col)

run_query()

"""
Created on Wed Oct  13 04:41:54 2021

@author: nirviksaha
"""

from flask import Flask, request, url_for, redirect, jsonify
from flask_cors import CORS
import json
import random
import ifcto3d
import os
from db import Database 


app=Flask(__name__)
cors = CORS(app)

#   end point 01
#   test url
@app.route("/", methods= ["GET"])
def start():
    s={"msg": "bim access server call successful"}
    print(s)
    return jsonify(s)


#   end point 02
#   only return the document - do not upload to db
#   ui: loadersMain.js
@app.route("/review-ifc-spf", methods=["POST", "GET"])
def review_ifc_spf():
    print("request received")
    if request.method=="POST":
        f=request.files['filename']
        print(f.filename)
        chunk = f.stream.read()
        s=chunk.decode(encoding='UTF-8')
        if(len(s) == 0):
            return ({"msg": "no data"})
        #
        r_filename=f.filename
        #
        with open(r_filename, "w") as file:
            file.writelines(s)

        x = ifcto3d.runExportFuncs(r_filename)
        y={"data": x["products"]}
        if os.path.exists(r_filename):
            os.remove(r_filename)
        else:
            print("The file does not exist")
        return x
    else:
        return  jsonify({"msg":"try POST method"})


#   end point 03
#   return the document and upload to db
#   ui: loadersMain.js
@app.route("/upload-ifc-spf", methods=["POST", "GET"])
def upload_ifc_spf():
    print("request received")
    if request.method=="POST":
        f=request.files['filename']
        print(f.filename)
        chunk = f.stream.read()
        s=chunk.decode(encoding='UTF-8')
        if(len(s) == 0):
            return ({"msg": "no data"})
        #
        r_filename, col_name=f.filename, f.filename.split(".")[0]
        #
        with open(r_filename, "w") as file:
            file.writelines(s)
        x = ifcto3d.runExportFuncs(r_filename)
        data_arr={"data": x["products"]}
        if os.path.exists(r_filename):
            os.remove(r_filename)
        else:
            print("The file does not exist")

        # db upload
        db=Database()
        db.upload_json_arr(col_name, data_arr)

        print("upload complete")
        return x
    else:
        print("error in upload")
        return  jsonify({"msg":"try POST method"})


#   end point 04
#   return all collections in db- bits
#   ui: loadFromDB.js
@app.route("/get-col-from-dbs", methods=["GET", "POST"])
def get_from_dbs():
    db=Database()
    x=db.list_collections()
    t=json.dumps({"collections":x})
    return t


#   end point 05
#   return all distinct types from given collection name & uuid
#   ui: collectionObj.js
@app.route("/get-types-col", methods=["GET", "POST"])
def get_col():
    print("getting the types in a collection")
    if request.method == "POST":
        name=request.form["name"]
        uuid=request.form["uuid"]
        db=Database()
        collection = db.get_collection(name, uuid)
        distinct_types_obj=db.get_distinct_types_in_collection(collection)
        return json.dumps({"distinct_types": distinct_types_obj})
    else:
        print("try post request")
        return jsonify({"msg": "try post request"})


#   end point 06
#   return all props of distinct types from given collection name & uuid
#   ui: collectionObj.js
@app.route("/get-types-data-col", methods=["GET", "POST"])
def get_col_type_props():
    print("getting the types-data in a collection")
    if request.method == "POST":
        namex=request.form["name"]
        uuidx=request.form["uuid"]
        typex=request.form["type"]
        print(namex, uuidx, typex)
        #
        db=Database()
        collection = db.get_collection(namex, uuidx)
        distinct_types_obj=db.get_type_data_from_collection(collection, typex)
        return json.dumps({"products": distinct_types_obj})
    else:
        print("try post request")
        return jsonify({"msg": "try post request"})


#   end point 07
#   union distinct types in different files
#   ui: query.js
@app.route("/union-types-in-files", methods=["GET", "POST"])
def union_types():
    if request.method == "POST":
        namex=request.form["fileobjarr"]
        file_obj_arr=json.loads(namex)
        #
        db=Database()
        union_arr=db.union_types_props_in_files(file_obj_arr)
        return jsonify({"types": union_arr[0], "properties": union_arr[1]})
    else:
        print("try post request")
        return jsonify({"msg": "try post request"})


#   end point 08
#   intersection distinct types in different files
#   ui: setOps.js
@app.route("/intersection-in-files", methods=["GET", "POST"])
def intersection_types():
    print("get intersection types in files")
    if request.method == "POST":
        namex=request.form["fileobjarr"]
        file_obj_arr=json.loads(namex)
        #
        db=Database()
        intersection_arr=db.intersection_elems_in_files(file_obj_arr)
        type_arr=[]
        for e in intersection_arr:
            t=e["type"]
            if t not in type_arr:
                type_arr.append(t)
        #
        ret_arr=[]
        for t in type_arr:
            obj={}
            obj["type"] =t
            elems=[]
            for e in intersection_arr:
                if e["type"] == t:
                    elems.append(e)
            obj["elems"] = elems
            ret_arr.append(obj)
        return jsonify({"products": intersection_arr, "types": ret_arr})
    else:
        print("try post request")
        return jsonify({"msg": "try post request"})


#   end point 09
#   difference distinct types in different files
#   ui: setOps.js
@app.route("/difference-in-files", methods=["GET", "POST"])
def difference_types():
    print("get difference types in files")
    if request.method == "POST":
        namex=request.form["fileobjarr"]
        file_obj_arr=json.loads(namex)
        #
        db=Database()
        difference_arr=db.difference_elems_in_files(file_obj_arr)
        type_arr=[]
        for e in difference_arr:
            t=e["type"]
            if t not in type_arr:
                type_arr.append(t)
        #
        ret_arr=[]
        for t in type_arr:
            obj={}
            obj["type"] =t
            elems=[]
            for e in difference_arr:
                if e["type"] == t:
                    elems.append(e)
            obj["elems"] = elems
            ret_arr.append(obj)
        return jsonify({"products": difference_arr, "types": ret_arr})
    else:
        print("try post request")
        return jsonify({"msg": "try post request"})


#   end point 10
#   query on file (s)
#   ui: query.js
@app.route("/query", methods=["GET", "POST"])
def query():
    print("running query")
    if request.method=="POST":
        namex=request.form["query"]
        file_obj_arr=json.loads(namex)
        db=Database()
        out=db.query(file_obj_arr)
        for i in out:
            print("\n", json.dumps(i, indent=2))
        print("query over")
        return jsonify({"products": out})
    else:
        print("try post request")
        return jsonify({"msg": "try post request"})


if __name__ == "main":
    app.run()






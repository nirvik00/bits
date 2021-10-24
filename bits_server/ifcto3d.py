"""
Created on Wed Oct  13 04:41:54 2021

@author: nirviksaha
"""

import ifcopenshell
import ifcopenshell.geom as geom
import json

def procVerts(verts):
    ver = []
    for i in range(0, len(verts)-2, 3):
        p = verts[i]
        q = verts[i + 1]
        r = verts[i + 2]
        ver.append([p, q, r])
    return ver

def procFaces(verts, faces):
    face_triples = []
    for i in range(0, len(faces), 3):
        p = faces[i]
        q = faces[i + 1]
        r = faces[i + 2]
        face_triples.append([p, q, r])
    face_verts = []
    for face in face_triples:
        a = verts[face[0]]
        b = verts[face[1]]
        c = verts[face[2]]
        # vertex = {'x': verts[face[0]], 'y': verts[face[1]], 'z': verts[face[2]]}
        # face_verts.append([a, b, c])
        face_verts.append(a)
        face_verts.append(b)
        face_verts.append(c)
    return face_triples

def write_to_file(prod):
    f=open("res.json", "a")
    json.dump(prod, f, indent=4)
    f.close()


def runExportFuncs(r_filename):
    print("running export funcs")
    settings = geom.settings()
    settings.set(settings.USE_WORLD_COORDS, True)
    f = ifcopenshell.open(r_filename)
    product_name_li=[]
    product_li=[]
    for product in f.by_type("IfcProduct"):
        prod=product.is_a()
        props=[]
        props_name=[]
        try:
            for definition in product.IsDefinedBy:
                # To support IFC2X3, we need to filter our results.
                if definition.is_a('IfcRelDefinesByProperties'):
                    property_set = definition.RelatingPropertyDefinition
                    for property in property_set.HasProperties:
                        if property.is_a('IfcPropertySingleValue'):
                            try:
                                prop_name=str(property.Name).strip()
                                if len(prop_name) <1:
                                    prop_name="unknown"
                                prop_name=str(property.Name).replace('.', '_')
                                prop_name=str(property.Name).replace(' ', '_')
                                prop_name=prop_name.lower()
                                if prop_name in props_name: 
                                    continue
                                else:
                                    props_name.append(prop_name)
                                    x={prop_name: property.NominalValue.wrappedValue}
                                    props.append(x)
                            except:
                                pass
                    if property_set.is_a('IfcPropertySet'):
                        for property in property_set.HasProperties:
                            try:
                                prop_name=str(property.Name).strip()
                                if len(prop_name) <1:
                                    prop_name="unknown"
                                prop_name=str(property.Name).replace('.', '_')
                                prop_name=str(property.Name).replace(' ', '_')
                                prop_name=prop_name.lower()
                                x={prop_name: property.NominalValue.wrappedValue}
                                if prop_name in props_name: 
                                    continue
                                else:
                                    props_name.append(prop_name)
                                    x={prop_name: property.NominalValue.wrappedValue}
                                    props.append(x)
                            except:
                                pass
        except:
            pass
        
        if prod not in product_name_li:
            product_name_li.append(prod)
        try:
            shape = ifcopenshell.geom.create_shape(settings, product)
            geo = shape.geometry
            obj_verts = procVerts(geo.verts)
            obj_faces = procFaces(obj_verts, geo.faces)
            prod_name="unknown"
            if len(product.Name.strip()) >1:
                prod_name=product.Name
            #
            prod= json.dumps({"global_id": product.GlobalId, "type": product.is_a(), "vertices": obj_verts, "faces": obj_faces, "name": prod_name, "properties": props})

            product_li.append(prod)
            #
            #   write_to_file(prod)
            #
        except Exception as e:
            #   print('error --> ', e)
            pass


    return {"products":product_li, "categories":product_name_li }


""" 
# driver
runExportFuncs("wall_door.ifc")
"""

import * as THREE from 'three';

//
// entry point
//

function display(product_type) {
	let product_types = [
		'IfcSlab',
		'IfcWallStandardCase',
		'IfcStair',
		'IfcBeam',
		'IfcColumn',
		'IfcOpeningElement',
		'IfcRoof',
		'IfcFooting',
		'IfcRampFlight',
		'IfcStairFlight',
		'IfcFlowTerminal',
		'IfcMember',
		'IfcRailing',
		'IfcFurnishingElement',
		'IfcCovering',
		'IfcPlate',
		'IfcWindow',
		'IfcSpace',
	];
	if (product_type === 'IfcSlab') {
		return { color: 0xfff000, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcWallStandardCase') {
		return { color: 0xff0000, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcStair') {
		return { color: 0x999999, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcBeam') {
		return { color: 0x0000ff, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcColumn') {
		return { color: 0xff0000, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcOpeningElement') {
		return { color: 0xff00ff, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcRoof') {
		return { color: 0xff9812, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcFooting') {
		return { color: 0x00fe23, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcRampFlight') {
		return { color: 0x662ef1f, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcStairFlight') {
		return { color: 0x999999, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcFlowTerminal') {
		return { color: 0xfa00c2, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcRailing') {
		return { color: 0xaa0076, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcMember') {
		return { color: 0xbf0146, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcFurnishingElement') {
		return { color: 0xffbb46, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcCovering') {
		return { color: 0xabcdef, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcPlate') {
		return { color: 0x823040, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcWindow') {
		return { color: 0xa3fbbff, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcDoor') {
		return { color: 0xb3fbbff, opacity: 0.25, transparent: true };
	} else if (product_type === 'IfcSpace') {
		return { color: 0x00a288, opacity: 0.15, transparent: true };
	} else {
		return { color: 0x999f00, opacity: 0.15, transparent: true };
	}
}

export const genGeomFunc = (product_data) => {
	let objArr = [];
	for (var i = 0; i < product_data.length; i++) {
		// make objects from ifc data
		let vertices_ = product_data[i].vertices;
		let faces_ = product_data[i].faces;
		if (faces_ && faces_.length > 0) {
			let vertices = [];
			let faces = [];
			let indices = [];
			faces_.forEach((f) => {
				faces.push({ a: f[0], b: f[1], c: f[2] });
			});
			vertices_.forEach((v) => {
				vertices.push({ x: v[0], y: v[1], z: v[2] });
			});
			let geometry = new THREE.BufferGeometry();
			let points = [];
			faces.forEach((f) => {
				points.push(vertices[f.a], vertices[f.b], vertices[f.c]);
			});
			let D = display(product_data[i].type);
			let material = new THREE.MeshPhongMaterial({
				color: D.color,
				opacity: D.opacity,
				transparent: true,
				side: THREE.DoubleSide,
			});
			geometry.setFromPoints(points);
			geometry.computeVertexNormals();
			let me = new THREE.Mesh(geometry, material);
			//
			let box = new THREE.Box3();
			me.geometry.computeBoundingBox();
			const boxMe = new THREE.BoxHelper(me, 0xffff00);
			//
			let obj2 = {
				type: product_data[i].type,
				globalId: product_data[i].global_id,
				name: product_data[i].name,
				mesh: me,
				color: D.color,
				opacity: D.opacity,
				transparent: true,
				selected: false,
				props: product_data[i].props,
				box,
				boxMe,
			};
			objArr.push(obj2);
		} else {
		}
	}
	return objArr;
};

function drawFaces(scene, meshArr) {
	meshArr.forEach((me) => {
		scene.add(me);
	});
}

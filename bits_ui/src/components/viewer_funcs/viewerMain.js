import React, { Fragment, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { genGeomFunc } from './nsFunc3d';

//
var DIV;
var ObjectArr = [];
var scene3d, camera3d, renderer3d, controls3d, raycaster3d, mouse;
var width, height;

//
const Viewer = ({ geomData, getSelObjects, controlOpt, clearAllObjects }) => {
	const [showOutline, setShowOutline] = useState(false);
	//

	useEffect(() => {
		if (geomData.data) {
			generate3dView();
		}
	}, [geomData]);

	useEffect(() => {
		handleViewOptions(controlOpt);
		controlOpt = '';
	}, [controlOpt]);

	useEffect(() => {
		if (showOutline) {
			ObjectArr.forEach((obj) => {
				try {
					let m1 = new THREE.LineBasicMaterial({
						color: 0x000000,
					});
					obj.boxMe.material = m1;
					scene3d.add(obj.boxMe);
				} catch (err) {}
			});
		} else if (!showOutline) {
			ObjectArr.forEach((obj) => {
				try {
					obj.boxMe.geometry.dispose();
					obj.boxMe.material.dispose();
					scene3d.remove(obj.boxMe);
				} catch (err) {}
			});
		}
	}, [showOutline]);

	//
	var select = false;
	const clearObj = () => {
		ObjectArr.forEach((obj) => {
			if (obj.mesh) {
				obj.mesh.geometry.dispose();
				obj.mesh.material.dispose();
				scene3d.remove(obj.mesh);
				delete obj.mesh;
			}
			try {
				if (obj.boxMe) {
					obj.boxMe.geometry.dispose();
					obj.boxMe.material.dispose();
					scene3d.remove(obj.boxMe);
				}
			} catch (err) {}
		});
		ObjectArr = [];
	};

	//
	const generate3dView = () => {
		DIV = document.getElementById('viewerDiv3d');
		while (DIV.children.length > 0) {
			DIV.removeChild(DIV.firstChild);
		}
		width = DIV.getBoundingClientRect().width;
		height = DIV.getBoundingClientRect().height;

		mouse = {
			x: 0,
			y: 0,
			height: 0,
			width: 0,
		};
		raycaster3d = new THREE.Raycaster();
		//
		scene3d = new THREE.Scene();
		scene3d.background = new THREE.Color('#fff');
		//
		camera3d = new THREE.PerspectiveCamera(45, width / height, 0.01, 100000);
		camera3d.position.set(25, 25, 25);
		camera3d.up = new THREE.Vector3(0, 0, 1);
		//
		renderer3d = new THREE.WebGLRenderer();
		renderer3d.setSize(width, height);
		DIV.appendChild(renderer3d.domElement);
		//
		let axes = new THREE.AxesHelper(15);
		scene3d.add(axes);
		//
		controls3d = new OrbitControls(camera3d, renderer3d.domElement);
		controls3d.addEventListener('onchange', updateWindow);
		//
		addLight(scene3d);
		//
		if (!geomData.data) return;
		clearObj();
		let product_data = geomData.data.products;
		ObjectArr = genGeomFunc(product_data); // goto function
		ObjectArr.forEach((obj) => {
			if (obj.mesh !== 0) {
				try {
					obj.mesh.material = new THREE.MeshPhongMaterial({
						color: obj.color,
						opacity: obj.opacity,
						transparent: true,
						side: THREE.DoubleSide,
					});
					scene3d.add(obj.mesh);
					if (obj.boxMe) {
						let m1 = new THREE.LineBasicMaterial({
							color: 0xcccccc,
						});
						obj.boxMe.material = m1;
						scene3d.add(obj.boxMe);
					}
				} catch (err) {}
			}
		});

		//
		DIV.addEventListener('mousedown', onMouseDown, false); // 	select
		render();
	};

	// controls - orbit pan
	var updateWindow = () => {
		camera3d.aspect = width / height;
		camera3d.updateProjectionMatrix();
		renderer3d.setSize(width, height);
	};

	//
	const addLight = (scene3d) => {
		let light1 = new THREE.AmbientLight(0xffffff);
		scene3d.add(light1);
	};

	//
	const render = () => {
		var m1 = new THREE.MeshPhongMaterial({
			color: 0xffff00,
			opacity: 1.0,
			transparent: false,
		});

		var m2 = new THREE.MeshPhongMaterial({
			color: new THREE.Color('rgb(255,0,0)'),
			opacity: 0.75,
			transparent: true,
		});
		ObjectArr.forEach((obj) => {
			if (obj.selected === true) {
				obj.mesh.material = m2;
				try {
					if (obj.boxMe) {
						let m1 = new THREE.LineBasicMaterial({
							color: 0x000000,
						});
						obj.boxMe.material = m1;
						scene3d.add(obj.boxMe);
					}
				} catch (err) {}
			} else {
				if (obj.mesh !== 0) {
					obj.mesh.material = new THREE.MeshPhongMaterial({
						color: new THREE.Color(obj.color),
						opacity: obj.opacity,
						transparent: obj.transparent,
					});
				}
			}
		});

		requestAnimationFrame(render);
		renderer3d.render(scene3d, camera3d);
	};

	//
	document.addEventListener('keyup', (evt) => {
		if (evt.key === 'Control') {
			select = false;
		}
	});

	//
	document.addEventListener('keydown', (evt) => {
		if (evt.key === 'Escape') {
			ObjectArr.forEach((obj) => (obj.selected = false));
			// get3dObjectArr(ObjectArr);
		}
	});

	//
	function onMouseDown(e) {
		//
		e.preventDefault();
		document.addEventListener('keydown', (evt) => {
			if (evt.key === 'Control') {
				select = true;
			}
		});
		mouse.x =
			(((e.clientX - DIV.getBoundingClientRect().left) * width) /
				DIV.getBoundingClientRect().width /
				width) *
				2 -
			1;
		mouse.y =
			(((e.clientY - DIV.getBoundingClientRect().top) * height) /
				DIV.getBoundingClientRect().height /
				height) *
				-2 +
			1;
		raycaster3d.setFromCamera(mouse, camera3d);
		//
		const intersects = raycaster3d.intersectObjects(scene3d.children);
		//
		if (intersects.length > 0 && intersects[0].object.type === 'Mesh') {
			const me = ObjectArr.filter(
				(obj) => obj.mesh.uuid === intersects[0].object.uuid
			)[0];
			if (me && select) {
				me.selected = !me.selected;
			} else {
				ObjectArr.filter((obj) =>
					obj.mesh.uuid === intersects[0].object.uuid
						? (obj.selected = true)
						: (obj.selected = false)
				);
			}
		} /* else if (!select) {
			ObjectArr.forEach((obj) => (obj.selected = false));
		} */

		let selObjects = ObjectArr.filter((e) => e.selected === true);
		getSelObjects(selObjects);
	}

	//
	const handleViewOptions = (controlOpt) => {
		if (!controlOpt || controlOpt.length < 1) return;
		let v_opt = controlOpt[controlOpt.length - 1];
		if (v_opt.param === 'a') {
			//									unhide all
			ObjectArr.forEach((e) => {
				if (e.mesh.type === 'Mesh') {
					scene3d.add(e.mesh);
					e.hide = false;
				}
			});
		} else if (v_opt.param === 'b') {
			// 									isolate selected
			ObjectArr.forEach((e) => {
				if (e.selected === false) {
					e.mesh.geometry.dispose();
					e.mesh.material.dispose();
					scene3d.remove(e.mesh);
					e.hide = true;
				} else {
					console.log(e.globalId);
					e.selected = false;
				}
			});
		} else if (v_opt.param === 'c') {
			// 									hide selected
			ObjectArr.forEach((e) => {
				if (e.selected === true) {
					e.mesh.geometry.dispose();
					e.mesh.material.dispose();
					scene3d.remove(e.mesh);
					e.selected = false;
					e.hide = true;
					try {
						e.boxMe.geometry.dispose();
						e.boxMe.material.dispose();
						scene3d.remove(e.boxMe);
					} catch (err) {}
				}
			});
		} else if (v_opt.param === 'x') {
			setShowOutline(!showOutline);
			console.log(showOutline);
			// 									hide selected
			if (showOutline) {
				ObjectArr.forEach((e) => {
					try {
						scene3d.add(e.boxMe);
					} catch (err) {}
				});
			} else {
				ObjectArr.forEach((e) => {
					try {
						e.boxMe.geometry.dispose();
						e.boxMe.material.dispose();
						scene3d.remove(e.boxMe);
					} catch (err) {}
				});
			}
		} else if (v_opt.param === 'd') {
			let cateArr = v_opt.val.split(',');
			// 						isolate selected category
			ObjectArr.forEach((e) => {
				let t = 0;
				cateArr.forEach((cate) => {
					if (
						e.type.toString().toLowerCase() ===
						cate.toString().trim().toLowerCase()
					) {
						t++;
					}
				});
				if (t === 0) {
					e.mesh.geometry.dispose();
					e.mesh.material.dispose();
					scene3d.remove(e.mesh);
					e.selected = false;
					e.hide = true;
				} else {
					scene3d.add(e.mesh);
					e.selected = false;
					e.hide = false;
				}
			});
		} else if (v_opt.param === 'e') {
			let cateArr = v_opt.val.split(',');
			// 									hide selected category
			cateArr.forEach((cate) => {
				ObjectArr.forEach((e) => {
					if (
						e.type.toString().toLowerCase() ===
						cate.toString().trim().toLowerCase()
					) {
						e.mesh.geometry.dispose();
						e.mesh.material.dispose();
						scene3d.remove(e.mesh);
						e.selected = false;
						e.hide = true;
					}
				});
			});
		} else if (v_opt.param === 'f') {
			clearObj();
			clearAllObjects(true);
		} else if (v_opt.param === 'g') {
			ObjectArr.map((e) => (e.selected = false));
		}

		let selObjects = [];
		ObjectArr.forEach((obj) => {
			if (!obj.hide) {
				selObjects.push(obj);
			}
		});
		getSelObjects(selObjects);

		v_opt = '';
	};

	//
	return <Fragment></Fragment>;
};

//
export default Viewer;

import React, { useState, useEffect } from 'react';
import './App.css';

import Loaders from './components/loader_funcs/loadersMain';
import Controls from './components/viewer_funcs/controls';
import Viewer from './components/viewer_funcs/viewerMain';
import Properties from './components/properties';

function App() {
	const [geomData, setGeomData] = useState({});
	/* const [loadCollection, setLoadCollection] = useState([]); */
	const [selObjects, setSelObjects] = useState([]);
	const [controlOpt, setcontrolOpt] = useState([]);
	const [intersectionData, setIntersectionData] = useState([]);

	/* const [camPos, setCamPos] = useState({ x: 25, y: 25, z: 25 }); */

	/* const [clearAllObjects, setClearAllObjects] = useState(false); */
	var loadQueryFiles = [];
	useEffect(() => {
		loadQueryFiles = [];
	});

	const getGeomData = (prodObj, addToArray) => {
		if (addToArray) {
			let prods = prodObj.data.products;
			console.log(prods);
			if (geomData.data && geomData.data.products.length > 0) {
				geomData.data.products.forEach((e) => {
					prods.push(e);
				});
				prodObj.data.products = prods;
				setGeomData(prodObj);
			} else {
				setGeomData(prodObj);
			}
		} else {
			setGeomData(prodObj);
		}
	};

	const getSelObjects = (sel) => {
		setSelObjects(sel);
	};

	const getControlOpt = (opt) => {
		setcontrolOpt([...controlOpt, opt]);
	};

	/* const collectionToLoad = (x) => {
		setLoadCollection([...loadCollection, x]);
	}; */

	const clearAllObjectsFunc = (r) => {
		if (r === true) {
			setGeomData({});
		}
	};

	const intersectionDataX = (x) => {
		setIntersectionData(x);
		console.log(x);
	};

	return (
		<div className='grid-container'>
			<div className='item1 card flex'>
				<Loaders
					getGeomData={getGeomData}
					intersectionDataX={intersectionDataX}
				/>
			</div>

			<div className='item3 card flex' id='viewerDiv3d'>
				<Viewer
					geomData={geomData}
					getSelObjects={getSelObjects}
					controlOpt={controlOpt}
					clearAllObjects={clearAllObjectsFunc}
				/>
			</div>

			<div className='item4 card flex'>
				<Controls getControlOpt={getControlOpt} />
			</div>

			<div className='item5 card flex'>
				<Properties
					geomData={geomData}
					selObjects={selObjects}
					intersectionData={intersectionData}
				/>
			</div>
		</div>
	);
}

export default App;

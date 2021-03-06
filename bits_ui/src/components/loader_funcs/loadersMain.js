import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import LoadFromDB from './loadFromDB';
import SetOperationsTypes from '../queryFiles/setOpsMain';
import Query from '../queryFiles/query';

const Loaders = ({ getGeomData, setOpsDataX, queryOutFromApp }) => {
	const [uploadFile, setUploadFile] = useState('');
	const [queryFile, setQueryFile] = useState([]);
	const [btnClick, setBtnClick] = useState(true);

	// can be intersection or difference
	const setOpsData = (intxData) => {
		setOpsDataX(intxData);
		getGeomData(intxData, false);
	};

	const toggleShow = (e) => {
		e.preventDefault();
		setBtnClick(!btnClick);
	};

	const typeDataFromCollection = (x) => {
		getGeomData(x, true); // add to array for geom viewer / props
	};

	const reviewFileFunc = async (e) => {
		e.preventDefault();
		const dataArray = new FormData();
		dataArray.append('filename', uploadFile);
		try {
			let out = await axios.post(
				'http://192.168.1.151:5000/review-ifc-spf',
				dataArray,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			/* setServerRes(out); */
			let inpArr = out.data.products;
			let vals = [];
			inpArr.forEach((e) => {
				let x = JSON.parse(e);
				vals.push(x);
			});
			let data = { products: vals };
			let outArr = { data: data };
			getGeomData(outArr, false); // don't add to array for geom viewer / props
		} catch (err) {
			console.error(err);
		}
	};

	const uploadFileFunc = async (e) => {
		e.preventDefault();
		const dataArray = new FormData();
		dataArray.append('filename', uploadFile);
		try {
			let out = await axios.post(
				'http://192.168.1.151:5000/upload-ifc-spf',
				dataArray,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			/* setServerRes(out); */
			let inpArr = out.data.products;
			let vals = [];
			inpArr.forEach((e) => {
				let x = JSON.parse(e);
				vals.push(x);
			});
			let data = { products: vals };
			let outArr = { data: data };
			getGeomData(outArr, false); // don't add to array for geom viewer / props
		} catch (err) {
			console.error(err);
		}
	};

	const queryFileArrMainFunc = (p) => {
		setQueryFile([...new Set(queryFile), p]);
	};

	const queryOut = (x) => {
		getGeomData(x, false);
	};

	return (
		<div>
			<div className='upload-bar'>
				<div className='flex2'>
					<h1>Upload / Review IFC - SPF file </h1>
					<button className='btn btn-light' onClick={toggleShow}>
						{btnClick ? (
							<i className='fas fa-eye-slash'></i>
						) : (
							<i className='fas fa-eye'></i>
						)}
					</button>
				</div>

				{btnClick && (
					<div className='div-panel flex'>
						<input
							type='file'
							className='btn btn-light'
							onChange={(e) => setUploadFile(e.target.files[0])}
						/>
						<button className='btn btn-danger' onClick={reviewFileFunc}>
							<i className='fas fa-play'></i>
						</button>
						<button className='btn btn-danger' onClick={uploadFileFunc}>
							<i className='fas fa-cloud-upload-alt'></i>
						</button>
					</div>
				)}
			</div>

			<LoadFromDB
				typeDataFromCollection={typeDataFromCollection}
				queryFileArr={queryFileArrMainFunc}
			/>
			<br />
			<br />
			<Query queryFile={queryFile} queryOut={queryOut} />
			<br />
			<br />
			<SetOperationsTypes queryFile={queryFile} setOpsData={setOpsData} />
		</div>
	);
};

export default Loaders;

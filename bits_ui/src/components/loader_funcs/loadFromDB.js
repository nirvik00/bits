import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

import CollectionObject from './collectionObj';

const LoadFromDB = ({ typeDataFromCollection, queryFileArr }) => {
	const [collections, setCollections] = useState([]);
	const [btnClick, setBtnClick] = useState(true);
	const [counter, setCounter] = useState([0, 1, 2]);
	const count = 3; // display 3 at a time

	useEffect(() => {
		getIfcFilesFromDbs();
	}, []);

	const getIfcFilesFromDbs = async () => {
		// end point 4
		let out = await axios.get('http://192.168.1.151:5000/get-col-from-dbs', {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		setCollections(out.data.collections);
		queryFileArr([]);
		queryFileArrFunc([]);
	};

	const toggleShow = (e) => {
		e.preventDefault();
		setBtnClick(!btnClick);
	};

	const typeDataFunc = (x) => {
		typeDataFromCollection(x);
	};

	const xh = (
		<div className='flex2'>
			<h1>Database</h1>
			<div>
				<button className='btn btn-light' onClick={getIfcFilesFromDbs}>
					<i className='fas fa-sync'></i>
				</button>
				<button className='btn btn-light' onClick={(e) => showNext(e)}>
					<i className='fa fa-forward'></i>
				</button>
				<button className='btn btn-light' onClick={(e) => showPrev(e)}>
					<i className=' fa fa-backward'></i>
				</button>
				<button className='btn btn-light' onClick={toggleShow}>
					{btnClick ? (
						<i className='fas fa-eye-slash'></i>
					) : (
						<i className='fas fa-eye'></i>
					)}
				</button>
			</div>
		</div>
	);

	const showPrev = (e) => {
		e.preventDefault();
		let y = [
			Math.abs((counter[0] - count) % collections.length),
			Math.abs((counter[1] - count) % collections.length),
			Math.abs((counter[2] - count) % collections.length),
		];
		setCounter(y);
	};

	const showNext = (e) => {
		e.preventDefault();
		let y = [
			(counter[0] + count) % collections.length,
			(counter[1] + count) % collections.length,
			(counter[2] + count) % collections.length,
		];
		setCounter(y);
	};

	const queryFileArrFunc = (p) => {
		queryFileArr(p);
	};

	if (collections.length > 0) {
		return (
			<div>
				{xh}
				{btnClick && (
					<div>
						{counter[0] > -1 && counter[0] < collections.length && (
							<div>
								<CollectionObject
									collection={collections[counter[0]]}
									typeData={typeDataFunc}
									queryFileArr={queryFileArrFunc}
								/>
							</div>
						)}
						{counter[1] > -1 && counter[1] < collections.length && (
							<CollectionObject
								collection={collections[counter[1]]}
								typeData={typeDataFunc}
								queryFileArr={queryFileArrFunc}
							/>
						)}
						{counter[2] > -1 && counter[2] < collections.length && (
							<CollectionObject
								collection={collections[counter[2]]}
								typeData={typeDataFunc}
								queryFileArr={queryFileArrFunc}
							/>
						)}
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div>
				<p>No Data</p>
			</div>
		);
	}
};

export default LoadFromDB;

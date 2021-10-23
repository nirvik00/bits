import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const CollectionObject = ({ collection, typeData, queryFileArr }) => {
	const [distinctTypes, setDistinctTypes] = useState([]);
	const [hideTypes, setHideTypes] = useState(false);

	useEffect(() => {
		expandCollection();
	}, [collection]);

	useEffect(() => {
		distinctTypes.forEach((e) => {
			e.display = false;
		});
	}, [distinctTypes]);

	const remCollection = () => {
		setDistinctTypes([]);
	};

	const hideFunc = () => {
		setHideTypes(!hideTypes);
	};

	const expandCollection = async () => {
		const dataArray = new FormData();
		dataArray.append('name', collection.name);
		dataArray.append('uuid', collection.uuid);
		try {
			// end point 5
			let out = await axios.post(
				'http://192.168.1.151:5000/get-types-col',
				dataArray,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			setDistinctTypes(out.data.distinct_types);
		} catch (err) {
			console.error(err);
		}
	};

	const getTypeGeometry = async (evt, dtype_) => {
		evt.preventDefault();
		dtype_.display = true;
		let dtype = dtype_.type;
		var dataArray = new FormData();
		dataArray.append('name', collection.name);
		dataArray.append('uuid', collection.uuid);
		dataArray.append('type', dtype);
		try {
			// end point 6
			let out = await axios.post(
				'http://192.168.1.151:5000/get-types-data-col',
				dataArray,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			typeData(out);
		} catch (err) {
			console.error(err);
		}
	};

	const fileForQuery = (evt, x) => {
		evt.preventDefault();
		queryFileArr(x);
	};

	return (
		<div className='div-panel' key={collection.uuid}>
			<div className='elem flex2'>
				<h3>{collection.name.toUpperCase()}</h3>
				<div>
					<button
						className='btn btn-danger'
						onClick={(e) => fileForQuery(e, collection)}>
						<i className='fas fa-question'></i>
					</button>
					<button className='btn btn-danger' onClick={() => hideFunc()}>
						<i className='fas fa-glasses'></i>
					</button>
				</div>
			</div>
			<p>database UUID: {collection.uuid}</p>
			<br />

			{hideTypes && (
				<table className='collection-type-table'>
					<thead>
						<tr>
							<td>Type / Category</td>
							<td>Count</td>
							<td>Show 3d</td>
							<td>Showing?</td>
						</tr>
					</thead>
					<tbody>
						{distinctTypes.length > 0 &&
							distinctTypes.map((dtype) => (
								<tr key={Math.random() * 10000}>
									<td> {dtype.type}</td>
									<td> {dtype.count}</td>
									<td>
										<button onClick={(evt) => getTypeGeometry(evt, dtype)}>
											<i className='fas fa-play'> </i>
										</button>
									</td>
									<td>
										{!dtype.display ? (
											<button>
												<i className='fa fa-times'> </i>
											</button>
										) : (
											<button>
												<i className='fa fa-check'> </i>
											</button>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default CollectionObject;

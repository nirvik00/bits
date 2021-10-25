import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const Query = ({ queryFile }) => {
	const [showApp, setShowApp] = useState(false);
	const [showQuery, setShowQuery] = useState(false);
	const [showTypes, setShowTypes] = useState(false);
	const [showProperties, setShowProperties] = useState(false);
	const [distinctTypes, setDistinctTypes] = useState([]);
	const [distinctProperties, setDistinctPropertiess] = useState([]);

	const [selectedTypes, setSelectedTypes] = useState([]);
	const [selectedProperties, setSelectedProperties] = useState([]);
	const [isSelectedType, setIsSelectedType] = useState([]);
	const [isSelectedProp, setIsSelectedProp] = useState([]);

	useEffect(() => {
		queryFile = [...new Set(queryFile)];
	}, [queryFile]);

	const toggleShowApp = () => {
		queryFile = [...new Set(queryFile)];
		setShowApp(!showApp);
	};

	const toggleShowTypes = () => {
		setShowTypes(!showTypes);
	};

	const toggleShowProperties = () => {
		setShowProperties(!showProperties);
	};

	const getTypeProperties = async (evt) => {
		evt.preventDefault();

		queryFile = [...new Set(queryFile)];
		let i = 0;
		queryFile.forEach((e) => {
			if (Array.isArray(e)) {
				queryFile.splice(i, 1);
			}
			i++;
		});
		const dataArray = new FormData();
		dataArray.append('fileobjarr', JSON.stringify(queryFile));
		try {
			// end point 7
			let out = await axios.post(
				'http://192.168.1.151:5000/union-types-in-files',
				dataArray,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			setDistinctTypes(out.data.types);
			setDistinctPropertiess(out.data.properties);
		} catch (err) {
			console.error(err);
		}
	};

	const runQuery = async (evt) => {
		evt.preventDefault();
		queryFile = [...new Set(queryFile)];
		const dataArray = new FormData();
		let queryObj = {
			file: queryFile,
			types: selectedTypes,
			properties: selectedProperties,
		};
		dataArray.append('query', JSON.stringify(queryObj));
		try {
			// end point 7
			let out = await axios.post('http://192.168.1.151:5000/query', dataArray, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		} catch (err) {
			console.error(err);
		}
	};

	const showQueryHtml = (
		<Fragment>
			<div className='flex2'>
				<h1>Query / Schedule</h1>
				<button
					className='btn btn-select'
					onClick={(evt) => getTypeProperties(evt)}>
					Show Types & Properties
				</button>
				<button className='btn btn-light' onClick={toggleShowApp}>
					{showApp ? (
						<i className='fas fa-eye-slash'></i>
					) : (
						<i className='fas fa-eye'></i>
					)}
				</button>
			</div>
		</Fragment>
	);

	const listFileHtml = (
		<div className='div-panel'>
			<h3>Target File </h3>
			{queryFile.map((e) => (
				<div key={Math.random() * 100}>
					{e.name} {e.uuid}
				</div>
			))}
		</div>
	);

	const addType = (evt, val) => {
		evt.preventDefault();
		let x = [...new Set(selectedTypes)];
		x.push(val);
		let y = [...new Set(x)];
		setSelectedTypes(y);
	};

	const remType = (evt, val) => {
		evt.preventDefault();
		let x = [...new Set(selectedTypes)];
		let y = x.filter((e) => e !== val);
		setSelectedTypes(y);
	};

	const addProperty = (evt, val) => {
		evt.preventDefault();
		let x = [...new Set(selectedProperties)];
		x.push(val);
		let y = [...new Set(x)];
		setSelectedProperties(y);
	};

	const remProperty = (evt, val) => {
		evt.preventDefault();
		let x = [...new Set(selectedProperties)];
		let y = x.filter((e) => e !== val);
		setSelectedProperties(y);
	};

	const clearFields = (evt) => {
		evt.preventDefault();
		setSelectedTypes([]);
		setSelectedProperties([]);
	};

	const isSelectedTypeProperty = (val) => {
		let u = selectedProperties.filter((e) => val === e);
		let v = selectedTypes.filter((e) => val === e);
		if (u.length > 0 || v.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	const showTypesPropertiesHtml = (
		<Fragment>
			{distinctTypes.length > 0 && (
				<div className='flex2'>
					<h2>Select Types of Elements</h2>
					<button className='btn btn-danger' onClick={toggleShowTypes}>
						{showTypes ? (
							<i className='fas fa-eye-slash'></i>
						) : (
							<i className='fas fa-eye'></i>
						)}
					</button>
				</div>
			)}
			{showTypes && (
				<div className='div-panel'>
					<table className='table'>
						<tbody>
							{distinctTypes.map((e) => (
								<tr className='flex2' key={Math.random() * 100}>
									<td>{e}</td>
									<td>
										<button onClick={(evt) => addType(evt, e)}>
											<i className='fa fa-plus'></i>
										</button>
										<button onClick={(evt) => remType(evt, e)}>
											<i className='fas fa-minus'></i>
										</button>
										<input
											type='checkbox'
											checked={isSelectedTypeProperty(e)}
											onChange={(e) => 2}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<br />
			{distinctProperties.length && (
				<div className='flex2'>
					<h2>Select Properties of Elements</h2>
					<button className='btn btn-danger' onClick={toggleShowProperties}>
						{showProperties ? (
							<i className='fas fa-eye-slash'></i>
						) : (
							<i className='fas fa-eye'></i>
						)}
					</button>
				</div>
			)}
			{showProperties && (
				<div className='div-panel'>
					<table className='table'>
						<tbody>
							{distinctProperties.map((e) => (
								<tr className='flex2' key={Math.random() * 100}>
									<td>{e}</td>
									<td>
										<button onClick={(evt) => addProperty(evt, e)}>
											<i className='fa fa-plus'></i>
										</button>
										<button onClick={(evt) => remProperty(evt, e)}>
											<i className='fa fa-minus'></i>
										</button>
										<input
											type='checkbox'
											checked={isSelectedTypeProperty(e)}
											onChange={(e) => 2}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Fragment>
	);

	const queryFieldsHtml = (
		<div className='div-panel'>
			<form className='form form-group'>
				<div className='flex2'>
					<h3> Types</h3>
					<input
						type='text'
						value={selectedTypes}
						placeholder='Select from Types of Elements (below)'
					/>
				</div>
				<div className='flex2'>
					<h3> Properties </h3>
					<input
						type='text'
						value={selectedProperties}
						placeholder='Select from Properties of Elements (below)'
					/>
				</div>
				<br />
				<div className='flex'>
					<button
						className='btn btn-danger'
						onClick={(evt) => clearFields(evt)}>
						Clear Fields
					</button>
					<button className='btn btn-danger' onClick={(evt) => runQuery(evt)}>
						Submit for Query
					</button>
				</div>
			</form>
		</div>
	);

	const showOnSelectedFilesHtml = (
		<Fragment>
			{showQueryHtml}
			{listFileHtml}
			{queryFieldsHtml}
			{showTypesPropertiesHtml}
		</Fragment>
	);

	if (showApp && queryFile && queryFile.length > 0) {
		queryFile = [...new Set(queryFile)];
		return showOnSelectedFilesHtml;
	} else if (!showApp) {
		return showQueryHtml;
	} else {
		return (
			<div className='flex2'>
				<h1>Query / Schedule</h1>
				<h2>Select a file from the database</h2>
			</div>
		);
	}
};

export default Query;

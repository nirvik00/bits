import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const Query = ({ queryFile }) => {
	const [showApp, setShowApp] = useState(false);
	const [showQuery, setShowQuery] = useState(false);
	const [showTypes, setShowTypes] = useState(false);
	const [showProperties, setShowProperties] = useState(false);
	const [distinctTypes, setDistinctTypes] = useState([]);
	const [distinctProperties, setDistinctPropertiess] = useState([]);

	const [selectedTypes, setSelectedTypes] = useState('');
	const [selectedProperties, setSelectedProperties] = useState('');

	useEffect(() => {
		getTypeFields();
	}, []);

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

	const getTypeFields = async () => {
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
			// end point 6-a
			let out = await axios.post(
				'http://192.168.1.151:5000//union-types-in-files',
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

	const showQueryHtml = (
		<Fragment>
			<div className='flex2'>
				<h1>Query / Schedule</h1>
				<button className='btn btn-select' onClick={getTypeFields}>
					Assist
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

	const showTypesPropertiesHtml = (
		<Fragment>
			{distinctTypes.length > 0 && (
				<div className='flex2'>
					<h2>Types</h2>
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
										<input type='checkbox'></input>
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
					<h2>Properties</h2>
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
										<input type='checkbox'></input>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Fragment>
	);

	const submitForm = (e) => {};
	const queryFieldsHtml = (
		<div className='div-panel'>
			<form className='form form-group' submitForm={submitForm}>
				<div className='flex2'>
					<h3> Types</h3>
					<input
						type='text'
						value={selectedTypes}
						placeholder='Types separated by comma'
						onChange={(e) => setSelectedTypes(e.target.value)}
					/>
				</div>
				<div className='flex2'>
					<h3> Properties</h3>
					<input
						type='text'
						value={selectedProperties}
						placeholder='Properties separated by comma'
						onChange={(e) => setSelectedTypes(e.target.value)}
					/>
				</div>
				<div className='flex'>
					<button className='btn btn-danger'>Clear Fields</button>
					<button className='btn btn-danger'>Submit for Query</button>
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

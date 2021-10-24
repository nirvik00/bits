import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const Query = ({ queryFile }) => {
	const [showQuery, setShowQuery] = useState(true);

	const toggleShow = () => {
		setShowQuery(!showQuery);
	};

	const listFileHtml = (
		<Fragment>
			{queryFile.map((e) => (
				<div>
					{e.name} {e.uuid}
				</div>
			))}
		</Fragment>
	);

	const showQueryHtml = (
		<Fragment>
			<div className='flex2'>
				<h1>Query</h1>
				<button className='btn btn-light' onClick={toggleShow}>
					{showQuery ? (
						<i className='fas fa-eye-slash'></i>
					) : (
						<i className='fas fa-eye'></i>
					)}
				</button>
			</div>
		</Fragment>
	);

	const getTypeFields = async () => {
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
		} catch (err) {
			console.error(err);
		}
	};

	const showSelectedFilesHtml = (
		<Fragment>
			{showQueryHtml}
			{listFileHtml}
		</Fragment>
	);

	if (showQuery && queryFile && queryFile.length > 1) {
		return showSelectedFilesHtml;
	} else if (!showQuery) {
		return showQueryHtml;
	} else {
		return (
			<div className='flex2'>
				<h1>Query</h1>
				<h2>Select a file from the database</h2>
			</div>
		);
	}
};

export default Query;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetOperationsTypes = ({ queryFile, setOpsData }) => {
	const [btnClick, setBtnClick] = useState(false);
	const [showIntersection, setShowIntersection] = useState(false);
	const [showDifference, setShowDifference] = useState(false);

	const toggleShow = (e) => {
		e.preventDefault();
		setBtnClick(!btnClick);
	};

	const intersectionTypeOps = async (queryFile) => {
		let i = 0;
		queryFile.forEach((e) => {
			if (Array.isArray(e)) {
				queryFile.splice(i, 1);
			}
			i++;
		});
		setShowIntersection(!showIntersection);
		console.log(queryFile);
		const dataArray = new FormData();
		dataArray.append('fileobjarr', JSON.stringify(queryFile));
		try {
			// end point 5
			let out = await axios.post(
				'http://192.168.1.151:5000/intersection-in-files',
				dataArray,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			setOpsData(out);
		} catch (err) {
			console.error(err);
		}
	};

	const differenceTypeOps = async (queryFile) => {
		setShowDifference(!showDifference);
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
				'http://192.168.1.151:5000/difference-in-files',
				dataArray,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			setOpsData(out);
		} catch (err) {
			console.error(err);
		}
	};

	if (queryFile && queryFile.length > 1) {
		queryFile = [...new Set(queryFile)];
		let i = 0;
		for (let i = 0; i < queryFile.length; i++) {
			let e = queryFile[i];
			if (typeof e.uuid == 'undefined') {
				queryFile.splice(i, 1);
			}
		}
		return (
			<div>
				<div className='flex2'>
					<h1>Set Operations </h1>
					<button className='btn btn-light' onClick={toggleShow}>
						{btnClick ? (
							<i className='fas fa-eye-slash'></i>
						) : (
							<i className='fas fa-eye'></i>
						)}
					</button>
				</div>

				{btnClick && (
					<div>
						{queryFile && queryFile.length > 0 && (
							<div className='flex2 key={Math.random()*100}'>
								<h2>Target: </h2>
								<p> {queryFile[0].name} </p>
								<p> {queryFile[0].uuid} </p>
							</div>
						)}
						<section>
							<table>
								<tbody>
									{queryFile &&
										queryFile.length > 0 &&
										queryFile.map((e) => (
											<tr>
												<td> {e.name} </td>
												<td> </td>
												<td> {e.uuid} </td>
											</tr>
										))}
								</tbody>
							</table>
						</section>
						<br />
						<div className='flex2'>
							<button
								className='btn btn-select'
								onClick={() => intersectionTypeOps(queryFile)}>
								Common Elements
							</button>

							<button
								className='btn btn-select'
								onClick={() => differenceTypeOps(queryFile)}>
								Difference in Elements
							</button>
						</div>
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div>
				<h1>Set Operations</h1>
				<h3>(Select files: press ? next to database entry)</h3>
			</div>
		);
	}
};

export default SetOperationsTypes;

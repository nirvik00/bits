import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetOperationsTypes = ({ queryFile, intersectionData }) => {
	const [btnClick, setBtnClick] = useState(false);
	const [intersectionTypes, setIntersectionTypes] = useState([]);
	const [showIntersection, setShowIntersection] = useState(false);
	const [differenceTypes, setDifferenceTypes] = useState([]);
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
			setIntersectionTypes(out.data.types);
			intersectionData(out);
			console.log(out);
			// intersectionData(out.data.msg);
		} catch (err) {
			console.error(err);
		}
	};

	const differenceTypeOps = async (queryFile) => {
		let i = 0;
		queryFile.forEach((e) => {
			if (Array.isArray(e)) {
				queryFile.splice(i, 1);
			}
			i++;
		});
		setShowDifference(!showDifference);
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
			setDifferenceTypes(out.data.msg);
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
					<h1>Query</h1>
					<h3> (set intersection / difference in IFC-SPF)</h3>
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
							{showIntersection && (
								<button
									className='btn btn-primary'
									onClick={() => intersectionTypeOps(queryFile)}>
									Intersection Types
								</button>
							)}
							{!showIntersection && (
								<button
									className='btn btn-danger'
									onClick={() => intersectionTypeOps(queryFile)}>
									Intersection Types
								</button>
							)}
							<button
								className='btn btn-select'
								onClick={() => differenceTypeOps(queryFile)}>
								Difference Types
							</button>
						</div>
						<div>
							{showDifference && differenceTypes.length && (
								<div className='div-panel' key={Math.random() * 100}>
									<br />
									<h2>Difference</h2>
									{differenceTypes.map((e) => (
										<div key={Math.random() * 100}>
											<p>{e.type.toString()}</p>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div className='flex2'>
				<h1>Query</h1>
				<h3> Select from Database (press ? next to entry)</h3>
			</div>
		);
	}
};

export default SetOperationsTypes;

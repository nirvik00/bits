import React, { useState, useEffect } from 'react';

const Properties = ({ geomData, selObjects, intersectionData }) => {
	const [expandProps, setExpandProps] = useState(false);
	const maxStringLength = 35;

	useEffect(() => {
		getDistinctTypes();
	}, [selObjects]);

	useEffect(() => {
		console.log(intersectionData);
	}, [intersectionData]);

	const expandPropFunc = (e) => {
		e.preventDefault();
		setExpandProps(!expandProps);
	};

	const getDistinctTypes = () => {
		let distinctTypes = [];
	};

	if (selObjects && selObjects.length > 0) {
		return (
			<div className='div-properties'>
				<h1>Objects Loaded in 3d-Viewer</h1>
				<br />
				<button className='btn btn-primary' onClick={expandPropFunc}>
					Expand Properties
				</button>
				<br />
				<h2>Show Properties: {expandProps.toString().toUpperCase()} </h2>
				<br />
				{selObjects.length > 0 &&
					selObjects.map((e) => (
						<div key={Math.random() * 100000}>
							<h2>Type: {e.type}</h2>
							<p>ID: {e.globalId}</p>
							<p>Name: {e.name.substring(0, maxStringLength)}</p>
							<h2>Properties:</h2>
							{expandProps &&
								e.props.map((r) => (
									<p key={Math.random() * 100000}>
										{Object.keys(r).toString().substring(0, maxStringLength)} :
										{Object.values(r).toString().substring(0, maxStringLength)}
									</p>
								))}
							<br />
						</div>
					))}
			</div>
		);
	} else if (geomData.data && geomData.data.products.length > 0) {
		return (
			<div className='div-properties'>
				<h1>Objects Loaded in 3d-Viewer</h1>
				<br />
				{geomData.data.products.map((e) => (
					<div key={Math.random() * 100000}>
						<h3>type: {e.type.substring(0, maxStringLength)}</h3>
						<p>id: {e.global_id}</p>
						<p>name: {e.name.substring(0, maxStringLength)}</p>
						<br />
					</div>
				))}
			</div>
		);
	} else {
		return (
			<div className='div-properties'>
				<h2>No data & No selection</h2>
			</div>
		);
	}
};

export default Properties;

import React, { useState } from 'react';

const Controls = ({ getControlOpt }) => {
	const [cate, setCate] = useState({});
	const [vals, setVals] = useState('');

	const onChange = (e) => {
		e.preventDefault();
		console.log(e.target.value);
		setVals(e.target.value);
		setCate(e.target.value);
	};

	const isolateCategory = (e) => {
		e.preventDefault();
		getControlOpt({ param: 'd', val: cate });
	};

	const hideCategory = (e) => {
		e.preventDefault();
		getControlOpt({ param: 'e', val: cate, keyx: Math.random() * 100000 });
	};

	const setViewBtn = (e, x) => {
		e.preventDefault();
		getControlOpt({ param: x });
	};

	return (
		<div className='form-container'>
			<table>
				<tbody>
					<tr>
						<td>
							<p>Selected Element </p>
						</td>
						<td> </td>
						<td>
							<button
								className='btn btn-light'
								onClick={(e) => setViewBtn(e, 'a')}>
								<i className='fas fa-eye'></i>
							</button>
						</td>
						<td>
							<button
								className='btn btn-light'
								onClick={(e) => setViewBtn(e, 'b')}>
								<i className='fas fa-thumbtack'></i>
							</button>
						</td>
						<td>
							<button
								className='btn btn-light'
								onClick={(e) => setViewBtn(e, 'c')}>
								<i className='fas fa-eye-slash'></i>
							</button>
						</td>
						<td>
							<button
								className='btn btn-light'
								onClick={(e) => setViewBtn(e, 'x')}>
								<i className='fas fa-border-style'></i>
							</button>
						</td>
						<td>
							<p> Types / Categories separated by commas </p>
						</td>
						<td>
							<input
								type='text'
								placeholder='category'
								value={vals}
								name='cate'
								onChange={(e) => onChange(e)}
							/>
						</td>
						<td> </td>
						<td>
							<button className='btn btn-light' onClick={isolateCategory}>
								Isolate
							</button>
						</td>
						<td>
							<button className='btn btn-light' onClick={hideCategory}>
								Hide
							</button>
						</td>
						<td>
							<button
								className='btn btn-light'
								onClick={(e) => setViewBtn(e, 'f')}>
								Clear
							</button>
						</td>
						<td>
							<button
								className='btn btn-light'
								onClick={(e) => setViewBtn(e, 'g')}>
								De-Select
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Controls;

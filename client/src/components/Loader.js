import React from 'react';

export const Loader = () => {
	return (
		<div className="progress" style={{
			display: 'flex', justifyContent: 'center', paddingTop: '2rem'
		}}>
			<div className="indeterminate"></div>
		</div>
	);
}
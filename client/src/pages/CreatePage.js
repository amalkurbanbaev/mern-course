import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { useHttp } from '../hooks/hppt.hook';

export const CreatePage = () => {

	const history = useHistory();
	const auth = useContext(AuthContext);
	const { request } = useHttp();
	const [link, setLink] = useState('');
	
	useEffect(() => {
		window.M.updateTextFields()
	}, [])

	const pressHandler = async (event) => {
		if (event.key === 'Enter') {
			try {
				const data = await request('/api/link/generate', 'POST', { from: link }, {
					Authorization: `Bearer ${auth.token}`
				});
				history.push(`/detail/${data.link._id}`)
			} catch (error) {
				console.log(error);
			}
		}
	}
	
	return (
		<div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
			<h1> Create Page </h1>
			<input
				placeholder="Вставьте ссылку"
				id="link"
				type="text"
				value={link}
				onChange={e => setLink(e.target.value)}
				onKeyPress={pressHandler}
			/>
			<label htmlFor="link">Введите ссылку</label>
		</div>
	);
}
import React, { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/auth.context';
import { useHttp } from '../hooks/hppt.hook';
import { Loader } from '../components/Loader';
import { LinksList } from '../components/LinksList';

export const LinksPage = () => {

	const [ links, setLinks ] = useState([]);
	const { loading, request } = useHttp();
	const { token } = useContext(AuthContext);

	const fetchLinks = useCallback(
		async () => {
			try {
				const fetched = await request('/api/link', "GET", null, {
					Authorization: `Bearer ${token}`
				})
				setLinks(fetched);
			} catch (error) {
				console.log(error)
			}	
		},
		[token, request],
	)

	useEffect(() => {
		fetchLinks()
	}, [fetchLinks])

	if (loading) {
		return <Loader />
	}

	return (
		<>
			{
				!loading && <LinksList links={links} />
			}
		</>
	);
}
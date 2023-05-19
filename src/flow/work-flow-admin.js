import React, { useState, useEffect } from 'react';

import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CheckList from './check-list';

const WorkFlowAdmin = () => {
	// Variables to editor to general data
	const [ workFlow, setWorkFlow ] = useState('');

	// Variables to driven the CheckList data.
	const [ items, setItems] = useState([])

	const [ loading, setLoading ] = useState( false )

	const [ notice, setNotice ] = useState( '' )

	useEffect( () => {
		apiFetch.use( apiFetch.createNonceMiddleware( window.backVariables.nonce ) );
		// Get posts data to this category
		apiFetch( {
			path: '/soivigol/v2/get-workflow-options',
			method: 'GET',
		} ).then( ( res ) => {
			if ( res.soivigol_checklist_array ) {
				setItems( res.soivigol_checklist_array )
				setLoading( true )
			}
			setWorkFlow( res.soivigol_workflow_text )
		} )

	}, [])

	const onSaveData = () => {
		setNotice( __( 'Sending...', 'soivigol-notes' ) )
		apiFetch( {
			path: '/soivigol/v2/save-workflow-options',
			method: 'POST',
			data: { data: { soivigol_checklist_array: items, soivigol_workflow_text: workFlow } }
		} ).then( ( res ) => {
			console.log( res )
			if ( 'OK' === res.response ) {
				setNotice( __( 'Saved', 'soivigol-notes' ) )
				setTimeout( () => {
					setNotice( '' )
				},3000)
			}
		} )
	}
	return(
		<>
			<p className='text-big'>Checklist/Work Flow by default loaded in all sites.</p>
			<CheckList items={ items } setItems={ setItems } loading={ loading }/>
			<p className='text-big'>{ __( 'General text that will be inserted in all Check List/Work Flows', 'soivigol-notes' )}</p>
			<ReactQuill theme="snow" value={workFlow} onChange={setWorkFlow} />
			<button onClick={ onSaveData } className='button button-primary' >{ __( 'Save', 'soivigol-notes' ) }</button>
			<span className='soivigol-notice'>{ notice }</span>
		</>
	)
}
export { WorkFlowAdmin }

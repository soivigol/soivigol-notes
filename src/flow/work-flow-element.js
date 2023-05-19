import React, { useState, useEffect } from 'react';

import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

import {
	useSelect,
	useDispatch,
} from '@wordpress/data'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CheckList from './check-list';

const WorkFlowElement = () => {
	const [workFlow, setWorkFlow] = useState('');

	const [ loading, setLoading ] = useState( false )

	const getDefaultCheckList = () => {
		apiFetch.use( apiFetch.createNonceMiddleware( backVariablesNonce ) );
		// Get posts data to this category
		apiFetch( {
			path: '/soivigol/v2/get-workflow-options',
			method: 'GET',
		} ).then( ( res ) => {
			if ( res.soivigol_checklist_array ) {
				setItems( res.soivigol_checklist_array )
				setLoading( true )
			}
		} )
	}

	// param to save the data in current post.
    const { editPost } = useDispatch('core/editor');

	// Get the work flow content from the metafield.
	const workFlowMeta = useSelect((select) => {
        const current = select('core/editor').getEditedPostAttribute('meta')['soivigol_work_flow_content'];
		return current
    }, []);

	// Save the Work flow content in the metafield
    const saveWorkFlowMeta = (newValue) => {
		setWorkFlow( newValue )
		editPost( {
			meta: { soivigol_work_flow_content: newValue },
		} );
    };

	// Set the initial value in the Quill editor.
	useEffect( () => {
		setWorkFlow( workFlowMeta )
	},[])

	// Variables to driven the CheckList data.
	const [ items, setItems] = useState([])
	// Get the meta data to current post to Check List array
	useSelect( function ( select ) {
		const data = select( 'core/editor' ).getEditedPostAttribute(
			'meta'
		)[ 'soivigol_checklist_content' ];
		if ( data ) {
			setItems( JSON.parse( data ) )
			setLoading( true )
		} else {
			getDefaultCheckList()
		}
	}, [] );

	// Save data.
	const onChangeChecklist= ( content ) => {
		editPost( {
			meta: { soivigol_checklist_content: JSON.stringify( content ) },
		} );
	}

	return(
		<>
		 	<p className='text-big'>Checklist</p>
			<CheckList items={ items } setItems={ onChangeChecklist } loading={loading}/>
			<p className='text-big'>{ __( 'Add aditional notes to this post', 'soivigol-notes' )}</p>
			<ReactQuill theme="snow" value={workFlow} onChange={saveWorkFlowMeta} />
		</>
	)
}
export { WorkFlowElement }

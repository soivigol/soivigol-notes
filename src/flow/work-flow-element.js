import React, { useState, useEffect } from 'react';

import { __ } from '@wordpress/i18n';

import {
	useSelect,
	useDispatch,
} from '@wordpress/data'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CheckList from './check-list';

const FlowWorkElement = () => {
	const [workFlow, setWorkFlow] = useState('');

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
		}
	}, [] );

	// Save data.
	const onChangeChecklist= ( content ) => {
		setItems( content )
		editPost( {
			meta: { soivigol_checklist_content: JSON.stringify( content ) },
		} );
	}

	return(
		<>
			<CheckList items={ items } setItems={ onChangeChecklist }/>
			<p>{ __( 'Add aditional notes to this post', 'soivigol-notes' )}</p>
			<ReactQuill theme="snow" value={workFlow} onChange={saveWorkFlowMeta} />
		</>
	)
}
export { FlowWorkElement }

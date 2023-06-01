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

	const [ allowEditCheckbox, setAllowEditCheckbox ] = useState( '1' )

	const [ showEditorCheckbox, setShowEditorCheckbox ] = useState( '1' )

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
			setAllowEditCheckbox( res.soivigol_allow_edit_checklist )
			setShowEditorCheckbox( res.soivigol_show_quill_editor )
		} )

	}, [])

	const onSaveData = () => {
		setNotice( 'sending' )
		apiFetch( {
			path: '/soivigol/v2/save-workflow-options',
			method: 'POST',
			data: { data: {
					soivigol_checklist_array: items,
					soivigol_workflow_text: workFlow,
					soivigol_allow_edit_checklist: allowEditCheckbox,
					soivigol_show_quill_editor: showEditorCheckbox,
				} }
		} ).then( ( res ) => {
			if ( 'OK' === res.response ) {
				setNotice( 'send' )
				setTimeout( () => {
					setNotice( '' )
				},3000)
			}
		} )
	}

	const onChangeCheckbox = ( e ) => {
		if ( 'allow-edit-checklist' === e.target.name ) {
			const currentAllow = allowEditCheckbox;
			'0' === currentAllow ? setAllowEditCheckbox( '1' ) : setAllowEditCheckbox( '0' )
		} else {
			const currentEdit = showEditorCheckbox;
			'0' === currentEdit ? setShowEditorCheckbox( '1' ) : setShowEditorCheckbox( '0' )
		}
	}
	return(
		<>
			<p className='text-big'>{ __( 'Checklist/Work Flow', 'soivigol-notes' ) }</p>
			<p>{ __( 'Check list/Work flow created by default loaded in all sites. Once loaded, it\'s saved in each post with the content that it have in this moment.', 'soivigol-notes' ) }</p>
			<CheckList items={ items } setItems={ setItems } loading={ loading }/>
			<p className='text-big'>{ __( 'General notes', 'soivigol-notes' )}</p>
			<p>{ __( 'General text that will be inserted in all Check List/Work Flows', 'soivigol-notes' ) }</p>
			<ReactQuill theme="snow" value={workFlow} onChange={setWorkFlow} />
			<p>
				<label>
					<input type='checkbox' name='allow-edit-checklist' onChange={ onChangeCheckbox } checked={ '1' === allowEditCheckbox ? 'checked' : ''  } value={ allowEditCheckbox }/>
					{ __( 'Allow edit checklist/work flow in the editor sidebar? If you active this option, you will allow that in the post can move, remove and add items.', 'soivigol-notes' ) }
				</label>
			</p>
			<p>
				<label>
					<input type='checkbox' name='show-quill-editor' onChange={ onChangeCheckbox } checked={ '1' === showEditorCheckbox ? 'checked' : ''  } value={ showEditorCheckbox }/>
					{ __( 'Show the rich text editor in the sidebar?', 'soivigol-notes' ) }
				</label>
			</p>
			<p><button onClick={ onSaveData } className='button button-primary' >{ __( 'Save', 'soivigol-notes' ) }</button></p>
			{
				'sending' === notice ? (
					<div class="notice notice-warning"><p>{  __( 'Sending...', 'soivigol-notes' ) }</p></div>
				) : (
					notice && ( <div class="notice notice-success"><p>{ __( 'Saved', 'soivigol-notes' ) }</p></div> )
				)
			}
		</>
	)
}
export { WorkFlowAdmin }

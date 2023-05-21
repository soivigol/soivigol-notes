import React from 'react';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import {
   subscribe
} from '@wordpress/data';

import { WorkFlowElement } from './work-flow-element';

import './editor.scss'
import { WorkFlowAdmin } from './work-flow-admin';


/**
* Add Prebuilt Library button to Gutenberg toolbar
*/
function WorkFlow() {

	   const renderButton = ( selector ) => {
			const toolbarButton = document.createElement( 'div' );
			toolbarButton.classList.add( 'soivigol-work-flow' );
			selector.insertAdjacentElement( 'beforeend', toolbarButton );

		   	const btnOpenFlow = document.createElement( 'button' )
			btnOpenFlow.classList.add( 'components-button' )
			btnOpenFlow.classList.add( 'has-icon' )
			btnOpenFlow.classList.add( 'soivigol-work' )
			btnOpenFlow.setAttribute( 'aria-label', __( 'Work Flow/Checklist', 'soivigol-notes' ) )
			btnOpenFlow.title = __( 'Work Flow/Checklist', 'soivigol-notes' )
			btnOpenFlow.innerHTML = `<span class="dashicons dashicons-editor-ul"></span>`;

			const container = document.querySelector( '.soivigol-work-flow' )
			container.insertAdjacentElement( 'beforeend', btnOpenFlow )
	   }

	   const renderWorkFlow = ( selector ) => {
			const flow = document.createElement( 'div' )
			flow.classList.add( 'container-work-flow' )
			selector.insertAdjacentElement( 'beforeend', flow )
	   }

	  	const hasEventListener = (element, eventType) => {
			return typeof element[`on${eventType}`] === 'function';
		};

	   	subscribe( () => {
			const editToolbar = document.querySelector( '.edit-post-header-toolbar' )
			if ( ! editToolbar ) {
				return
			}
			if ( ! document.querySelector( '.soivigol-work-flow' ) ) {
				renderButton( editToolbar );
			}
		} );

		subscribe( () => {
			const bodyEditor = document.querySelector( '.interface-interface-skeleton__body' )
			if ( ! bodyEditor ) {
				return
			}
			if ( ! document.querySelector( '.container-work-flow' ) ) {
				renderWorkFlow( bodyEditor );
				const containerWorkFlow = document.querySelector( '.container-work-flow' );
				if ( containerWorkFlow ) {
					ReactDOM.render(
						<WorkFlowElement/>,
						containerWorkFlow
					)
				}
			}
		} );
	   return null;
}

registerPlugin( 'soivigol-work-flow', {
   render: WorkFlow,
} );

window.addEventListener( 'load', () => {
	const workFlow = document.getElementById('soivigol-check-list');
	if ( workFlow ) {
		ReactDOM.render(
			<WorkFlowAdmin/>,
			workFlow
		)
	}
	// Event to open and close the workflow container
	let inteval = setInterval(() => {
		const containerWorkFlow = document.querySelector( '.container-work-flow' );
		const btnOpenWorkFlow = document.querySelector( 'button.soivigol-work' )
		if ( btnOpenWorkFlow && containerWorkFlow ) {
			clearInterval( inteval )
			btnOpenWorkFlow.addEventListener( 'click', () => {
				const btnOpen = '<span class="dashicons dashicons-editor-ul"></span>';
				const btnClose = '<span class="dashicons dashicons-no"></span>';
				if ( containerWorkFlow.classList.contains( 'open' ) ) {
					containerWorkFlow.classList.remove( 'open' );
					btnOpenWorkFlow.innerHTML = btnOpen;
				} else {
					containerWorkFlow.classList.add( 'open' );
					btnOpenWorkFlow.innerHTML = btnClose;
				}
			});
		}
	}, 100);

});

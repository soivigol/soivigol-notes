import React from 'react';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

import { WorkFlowElement } from './work-flow-element';

import './editor.scss'
import { WorkFlowAdmin } from './work-flow-admin';


/**
* Add Prebuilt Library button to Gutenberg toolbar
*/
function WorkFlow() {

	/**
	 * Checks for the presence of an element in the document using the specified selector.
	 * @param {string} selector - The CSS selector to search for the element.
	 * @returns {Promise<Element>} - A promise that resolves with the first element matching the selector.
	 */
	const checkElement = async selector => {
		while ( document.querySelector(selector) === null) {
			await new Promise( resolve => requestAnimationFrame( resolve ) )
		}
		return document.querySelector(selector);
	}

	/**
	 * Renders a button element and appends it to the specified selector.
	 *
	 * @param {Element} selector - The element to which the button will be appended.
	 */
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

	/**
	 * Renders a work flow container element and appends it to the specified selector.
	 * @param {Element} selector - The element to which the work flow container will be appended.
	 */
	const renderWorkFlow = ( selector ) => {
		const flow = document.createElement( 'div' )
		flow.classList.add( 'container-work-flow' )
		selector.insertAdjacentElement( 'beforeend', flow )
	}

	// Check if the element exists
	checkElement( '.edit-post-header__center' ).then( ( el ) => {
		if ( ! document.querySelector( '.soivigol-work-flow' ) ) {
			renderButton( el );
		}
	} );

	// Check if the element exists
	checkElement( '.interface-interface-skeleton__body' ).then( ( el ) => {
		if ( ! document.querySelector( '.container-work-flow' ) ) {
			renderWorkFlow( el );
			const containerWorkFlow = document.querySelector('.container-work-flow');
			if (containerWorkFlow) {
				ReactDOM.render(<WorkFlowElement />, containerWorkFlow);
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

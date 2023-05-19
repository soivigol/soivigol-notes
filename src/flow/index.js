import React from 'react';
import ReactDOM from 'react-dom';

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
			btnOpenFlow.setAttribute( 'aria-label', 'Más campos' )
			btnOpenFlow.title = 'Campos'
			btnOpenFlow.innerHTML = `<svg id="Capa_1" enable-background="new 0 0 512.003 512.003" height="512" viewBox="0 0 512.003 512.003" width="512" xmlns="http://www.w3.org/2000/svg"><g><g><g><path d="m392.775 5.457h77.552v149.999h-77.552z" transform="matrix(.707 -.707 .707 .707 69.507 328.717)"/><path d="m96.566 318.029-40.095 137.509 137.507-40.096z"/><path d="m121.66 162.306h306.085v149.999h-306.085z" transform="matrix(.707 -.707 .707 .707 -87.342 263.749)"/></g><g><path d="m0 481.998h512v30h-512z"/></g></g></g></svg>`;

			const flow = document.createElement( 'div' )
			flow.classList.add( 'container-work-flow' )

			const container = document.querySelector( '.soivigol-work-flow' )
			container.insertAdjacentElement( 'beforeend', btnOpenFlow )
			container.insertAdjacentElement( 'beforeend', flow )
	   }

	   	subscribe( () => {
			const editToolbar = document.querySelector( '.edit-post-header-toolbar' )
			if ( ! editToolbar ) {
				return
			}
			if ( ! document.querySelector( '.soivigol-work-flow' ) ) {
				renderButton( editToolbar );
				const containerWorkFlow = document.querySelector( '.container-work-flow' );
				if ( containerWorkFlow ) {
					ReactDOM.render(
						<WorkFlowElement/>,
						containerWorkFlow
					)
				}
				const btnOpenWorkFlow = document.querySelector( 'button.soivigol-work' )
				if ( btnOpenWorkFlow && containerWorkFlow ) {
					btnOpenWorkFlow.addEventListener( 'click', () => {
						containerWorkFlow.classList.toggle( 'open' )
					})
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
});

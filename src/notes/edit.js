/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-edi tor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText, BlockControls } from '@wordpress/block-editor';

import {
	Toolbar,
	ToolbarButton,
	Icon,
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( props ) {
	const { attributes:{ note, noteList }, setAttributes } = props;

	const [ activateList, setActivateList ] = useState(false)

	useEffect( () => {
		if ( ! noteList ) {
			setActivateList( false )
		} else {
			setActivateList( true )
		}
	}, [noteList])
	return (
		<div { ...useBlockProps() }>
			<BlockControls>
					<Toolbar label={ __( 'Activate List option', 'soivigol-notes' ) }>
						<ToolbarButton
							icon={ <Icon icon="editor-ul" /> }
							label={ __( 'Activate List', 'soivigol-notes' ) }
							onClick={ () =>
								setActivateList( ! activateList )
							}
							isPressed={ activateList }
						>
						</ToolbarButton>

					</Toolbar>
				</BlockControls>
			 <RichText
				tagName="div"
				multiline="p"
				value={ note }
				placeholder='Insert here your note. You can use the list clicking in the toolbar button. With this option, will be inserted a list after this text.'
				onChange={ ( value ) =>
					setAttributes( { note: value } )
				}
			/>
			{
				activateList && (
					<RichText
						tagName="ul"
						multiline="li"
						value={ noteList }
						placeholder='Each item in this list'
						onChange={ ( value ) =>
							setAttributes( { noteList: value } )
						}
					/>
				)
			}
		</div>
	);
}

<?php
/**
 * Plugin Name:       Soivigol Notes
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.1
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       soivigol-notes
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function soivigol_notes_block_init() {
	register_block_type( __DIR__ . '/build/notes' );
	register_block_type( __DIR__ . '/build/flow' );

	register_post_meta( '', 'soivigol_work_flow_content', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string',
	) );

	register_post_meta( '', 'soivigol_checklist_content', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string',
	) );
}
add_action( 'init', 'soivigol_notes_block_init' );

/**
 * Regiter the blocks category called Soivigol Blocks to grouped my blocks.
 *
 * @param string $categories Categorias.
 */
function soivigol_category_blocks( $categories ) {
	return array_merge(
		array(
			array(
				'slug'  => 'soivigol-cats',
				'title' => __( 'Soivigol Blocks', 'soivigol-notes' ),
			),
		),
		$categories,
	);
}
add_filter( 'block_categories_all', 'soivigol_category_blocks', 10, 2 );

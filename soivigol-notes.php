<?php
/**
 * Plugin Name:       Soivigol Notes
 * Description:       Soivigol Notes provide you a block notes to annotations in the block editor that it don't show in the front end. Also provide a sidebard with a check list or work flow in each post with instructions to follow or step by step to write a post. This sidebar also has a editor rich text for additional annotations.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.1
 * Author:            David Viña
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       soivigol-notes
 *
 * @package           soivigol-notes
 */

define( 'SOIVIGOL_VERSION', '1.0.1' );

include_once plugin_dir_path( __FILE__ ) . 'admin/admin.php';

function soivigol_plugin_add_settings_link( $links, $file ) {
    // Check if the current plugin is your plugin
    if ( plugin_basename(__FILE__) === $file ) {
        // Add a custom settings link
        $settings_link = '<a href="' . admin_url( 'options-general.php?page=soivigol-workflow' ) . '">' . __( 'Settings', 'soivigol-notes' ) . '</a>';
        array_unshift( $links, $settings_link );
    }

    return $links;
}
add_filter( 'plugin_action_links', 'soivigol_plugin_add_settings_link', 10, 2 );

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

	add_action( 'admin_footer', 'soivigol_nonce_in_blocks' );

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
add_action( 'init', 'soivigol_notes_block_init', 8 );

/**
 * Add custom nonce in footer when bloks are register
 */
function soivigol_nonce_in_blocks() {
	$nonce = wp_create_nonce( 'wp_rest' );
	?>
	<script>var backVariablesNonce = "<?php echo esc_html( $nonce ); ?>";</script>
	<?php
}

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

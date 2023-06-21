<?php
/**
 * File where insert code to dashboard side.
 *
 * @package soivigol-notes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add menu into options.
 */
function soivigol_add_menu_workflow() {
	add_submenu_page(
		'options-general.php',
		__( 'Soivigol Check List', 'soivigol-notes' ),
		__( 'Soivigol Check List', 'soivigol-notes' ),
		'manage_options',
		'soivigol-workflow',
		'soivigol_render_admin_html_workflow',
	);
}
add_action( 'admin_menu', 'soivigol_add_menu_workflow' );

/**
 * Render div to inster the React aplication to create the check list and inster text.
 */
function soivigol_render_admin_html_workflow() {
	?>
	<style>
		#soivigol-check-list {
			max-width: 90%;
			background-color: white;
			padding: 1rem;
			margin-top: 2rem;
		}
		.quill {
			margin-bottom: 1rem;
		}
		.soivigol-notice {
			margin-left: 1rem;
			display: inline-flex;
			min-height: 30px;
			align-items: center;
		}
	</style>
	<div id="soivigol-check-list"></div>
	<?php
}

/**
 * Fuction that enqueue the scripts and estyles to general dashboard of the workflow.
 */
function soivigol_add_styles_and_scripts_to_workflow() {
	$current_screen = get_current_screen();

	if ( 'settings_page_soivigol-workflow' === $current_screen->id ) {
		$dir = dirname( __DIR__ );

		$script_asset_path = "$dir/build/flow/index.asset.php";

		$script_asset = require $script_asset_path;

		wp_enqueue_script( 'soivigol-flow_app', plugin_dir_url( __DIR__ ) . 'build/flow/index.js', $script_asset['dependencies'], $script_asset['version'], false );

		wp_enqueue_style( 'soivigol-flow-css_app', plugin_dir_url( __DIR__ ) . 'build/flow/index.css', array(), SOIN_VERSION );

		wp_localize_script(
			'soivigol-flow_app',
			'backVariables',
			array(
				'nonce' => wp_create_nonce( 'wp_rest' ),
			),
		);
	}
}
add_action( 'admin_enqueue_scripts', 'soivigol_add_styles_and_scripts_to_workflow' );

/**
 * Register all api calls from workflow admin.
 */
function soivigol_api_calls_from_workflow() {
	register_rest_route(
		'soivigol/v2',
		'get-workflow-options',
		array(
			'methods'             => 'GET',
			'callback'            => 'soivigol_get_workflow_options',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'soivigol/v2',
		'save-workflow-options',
		array(
			'methods'             => 'POST',
			'callback'            => 'soivigol_set_workflow_options',
			'permission_callback' => '__return_true',
		)
	);
}
add_action( 'rest_api_init', 'soivigol_api_calls_from_workflow' );

/**
 * Get all default data from the options.
 */
function soivigol_get_workflow_options() {
	$out = array();

	$out['soivigol_checklist_array']      = get_option( 'soivigol_checklist_array_default' );
	$out['soivigol_workflow_text']        = get_option( 'soivigol_workflow_text_default' );
	$out['soivigol_allow_edit_checklist'] = get_option( 'soivigol_allow_edit_checklist_default', '1' );
	$out['soivigol_show_quill_editor']    = get_option( 'soivigol_show_quill_editor_default', '1' );
	wp_send_json( $out );
}

/**
 * Save options related with workflows default values.
 *
 * @param  WP_REST_Request $request Params pass of front.
 */
function soivigol_set_workflow_options( WP_REST_Request $request ) {
	$data = $request['data'];

	update_option( 'soivigol_checklist_array_default', $data['soivigol_checklist_array'], false );
	update_option( 'soivigol_workflow_text_default', $data['soivigol_workflow_text'], false );
	update_option( 'soivigol_allow_edit_checklist_default', $data['soivigol_allow_edit_checklist'], false );
	update_option( 'soivigol_show_quill_editor_default', $data['soivigol_show_quill_editor'], false );

	$out = array( 'response' => 'OK' );
	wp_send_json( $out );
}

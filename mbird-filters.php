<?php
/**
 * Plugin Name: Mockingbird Filters
 * Description: A collection of filters for the Mockingbird theme.
 * Author: Kathleen Glackin
 * Author URI: http://kathleenglackin.com
 * Version: 1.0
 * 
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class MBird_Filters {
	private $shortcode_used = false;

	public function __construct() {
		// add_action( 'admin_menu', array( $this, 'mbird_filters_menu' ) );
		// add_action( 'admin_enqueue_scripts', array( $this, 'mbird_filters_scripts' ) );
		add_shortcode( 'mbird_filter', array( $this, 'mbird_filters_shortcode' ) );
		// add_action( 'wp', array( $this, 'conditionally_enqueue_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'mbird_filters_scripts' ) );

		add_action( 'wp_ajax_mbird_initial_load', array( $this, 'mbird_load_ajax' ) );
		add_action( 'wp_ajax_nopriv_mbird_initial_load', array( $this, 'mbird_load_ajax' ) );
	}

	// enqueue scripts
	public function mbird_filters_scripts() {
		wp_enqueue_style( 'mbird-filters-style', plugins_url( 'dist/css/style.css', __FILE__ ) );
		wp_enqueue_script( 'mbird-filters-class', plugins_url( 'dist/js/MBirdFilter.js', __FILE__ ), array( 'jquery' ), null, true );
		wp_enqueue_script( 'mbird-filters-script', plugins_url( 'dist/js/script.js', __FILE__ ), array( 'jquery' ), null, true );
		wp_localize_script( 'mbird-filters-script', 'mbirdFilters', array(
			'ajaxurl' => admin_url( 'admin-ajax.php' )
		));
	}

	// conditionally enqueue scripts
	public function conditionally_enqueue_scripts() {
		if ( $this->shortcode_used ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'mbird_filters_scripts' ) );
		}
	}

	// shortcode handler
	public function mbird_filters_shortcode( $atts ) {
		$this->shortcode_used = true;

		$atts = shortcode_atts( array(
			'post_type' => 'post',
			'filters' => '',
			'order' => 'ASC',
			'orderby' => 'name',
			'posts_per_page' => 9
		), $atts, 'mbird_filter' );

		$taxonomies = explode( ',', $atts['filters'] ); // convert filter options set to array

		$tax_query = array(
			'relation' => 'AND'
		);

		foreach($taxonomies as $tax) {
			$tax_query[] =
			array(
				'taxonomy' => $tax,
				'field' => 'slug',
				'terms' => array()
			);
		}

		$atts['tax_query'] = $tax_query;
		unset($atts['filters']);

		ob_start(); ?>
		<div class="ymc-smart-filter-container mbird-filter">
			<div class="mbird-filter-layout filter-layout3">
				<div class="sticky-block-wrapper">
					<form id="mbird-filter-form">
						<input type="hidden" name="shortcode_atts" value="<?php echo esc_attr( json_encode( $atts ) ); ?>" />
						
						<a class="btn-all" href="#" id="mbird-filter-reset"><?php _e('Reset', 'textdomain' ); ?></a>

						<?php foreach($taxonomies as $tax) :
							// get the full taxonomy object
							$full_tax = get_taxonomy( $tax ); ?>
							<div class="dropdown-filter tax-<?php echo esc_attr( $tax ); ?>">
								<a class="menu-active dropdown-toggle" id="dropdownMenuButton-<?php echo esc_attr( $tax ); ?>">
									<?php echo esc_html( $full_tax->labels->name ); ?>
									<i class="arrow down"></i>
								</a>

								<div class="dropdown-menu" id="dropdownMenu-<?php echo esc_attr( $tax ); ?>">
									<?php
									$terms = get_terms( array(
										'taxonomy' => $tax,
										'hide_empty' => false
									) );
									foreach ( $terms as $term ) : ?>
										<div class="dropdown-item">
											<input type="checkbox" id="filter-<?php echo esc_attr( $tax ); ?>-<?php echo esc_attr( $term->slug ); ?>" class="filter-checkbox" value="<?php echo esc_attr( $term->slug ); ?>" name="filter-<?php echo esc_attr( $tax ); ?>">
											<label for="filter-<?php echo esc_attr( $tax ); ?>-<?php echo esc_attr( $term->slug ); ?>"><?php echo esc_html( $term->name ); ?></label>
										</div>
									<?php endforeach; ?>
								</div>
							</div>
						<?php endforeach; ?>
					</form>

					<div class="table-header-wrap uag-hide-mob">
						<div class="grant-recipient-col">
							<p><?php _e('grant recipient', 'textdomain' ); ?></p>
						</div>
						<div class="grant-amount-col">
							<p><?php _e('amount', 'textdomain' ); ?></p>
						</div>
						<div class="grant-type-col">
							<p><?php _e('grant type', 'textdomain' ); ?></p>
						</div>
						<div class="grant-category-col">
							<p><?php _e('category', 'textdomain' ); ?></p>
						</div>
						<div class="grant-year-col">
							<p><?php _e('year', 'textdomain' ); ?></p>
						</div>
					</div>
				</div>
			</div>

			<div id="mbird-filter-results"></div>

			<div id="mbird-filter-loader">
				<img src="<?php echo plugins_url( 'dist/img/loader.svg', __FILE__ ); ?>" alt="Loading...">
			</div>

			<div class="mbird-filter-pagination">
				<button id="mbird-load-more" class="btn-load"><?php _e('Load More', 'textdomain' ); ?></button>
			</div>
		</div>

		<script>
			document.addEventListener("DOMContentLoaded", function() {
				mbirdFilter = new MBirdFilter();
			});
		</script>

		<?php
		$content = ob_get_clean();
		return $content;
	}

	// initial data load
	public function mbird_load_ajax() {
		// Retrieve shortcode attributes from the AJAX request
		$atts = isset($_POST['shortcode_atts']) ? json_decode(stripslashes($_POST['shortcode_atts']), true) : array();

		$page = isset( $_POST['page'] ) ? intval($_POST['page']) : 1;
		$posts_per_page = isset( $atts['posts_per_page'] ) ? $atts['posts_per_page'] : 9;

		$args = array(
			'post_type' => $atts['post_type'],
			'posts_per_page' => $posts_per_page,
			'order' => $atts['order'],
			'orderby' => $atts['orderby'],
			'paged' => $page
		);

		// conditionally set tax_query if any of the terms are set
		if (isset($atts['tax_query']) && !empty($atts['tax_query'])) {
			$tax_query = array_filter($atts['tax_query'], function($query) {
				return !empty($query['terms']);
			});

			if (!empty($tax_query)) {
				$args['tax_query'] = $tax_query;
			}
		}

		$posts = new WP_Query( $args );
		$output = '';

		if($posts->have_posts()) {
			ob_start();
			while($posts->have_posts()) {
				$posts->the_post();
				include plugin_dir_path( __FILE__ ) . 'templates/content-post.php';
			}
			$output = ob_get_clean();
		} else {
			$output = false;
		}

		wp_send_json($output);
	}

	// filter ajax
	public function mbird_filter_ajax() {
		// Basic static response
		$response = array(
			'status' => 'success',
			'message' => 'AJAX request received successfully.'
		);

		$response = $_POST['terms'];

		wp_send_json($response);
	}

	// activation hook
	public static function mbird_filters_activate() {
		add_option( 'mbird_filters_option', 'This is my option value.' );
	}

	//deactivation hook
	public static function mbird_filters_deactivate() {
		delete_option( 'mbird_filters_option' );
	}
}

// Instantiate the class
$mbird_filters = new MBird_Filters();
// add_action( 'admin_init', array( $mbird_filters, 'mbird_filters_init' ) );

// register the activation and deactivation hooks
register_activation_hook( __FILE__, array( $mbird_filters, 'mbird_filters_activate' ) );
register_deactivation_hook( __FILE__, array( $mbird_filters, 'mbird_filters_deactivate' ) );
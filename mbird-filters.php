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
		add_action( 'wp_enqueue_scripts', array( $this, 'conditionally_enqueue_scripts' ) );
		add_shortcode( 'mbird_filter', array( $this, 'mbird_filters_shortcode' ) );

		add_action( 'wp_ajax_mbird_filter', array( $this, 'mbird_filter_ajax' ) );
		add_action( 'wp_ajax_nopriv_mbird_filter', array( $this, 'mbird_filter_ajax' ) );
	}

	// enqueue scripts
	public function mbird_filters_scripts() {
		wp_enqueue_style( 'mbird-filters-style', plugins_url( 'assets/css/style.css', __FILE__ ) );
		wp_enqueue_script( 'mbird-filters-script', plugins_url( 'assets/js/script.js', __FILE__ ), array( 'jquery' ), null, true );
	}

	// conditionally enqueue scripts
	public function conditionally_enqueue_scripts() {
		if ( $this->shortcode_used ) {
			$this->mbird_filters_scripts();
		}
	}

	// shortcode handler
	public function mbird_filters_shortcode( $atts ) {
		$this->shortcode_used = true;

		$atts = shortcode_atts( array(
			'post_type' => 'post',
			'taxonomy' => 'category'
		), $atts, 'mbird_filter' );

		$taxonomies = explode( ',', $atts['taxonomy'] ); // Convert string to array

		ob_start();
		?>
		<div class="ymc-smart-filter-container mbird-filter">
			<div class="mbird-filter-layout filter-layout3">
				<div class="sticky-block-wrapper">
					<a class="btn-all" href="#" id="mbird-filter-reset"><?php _e('Reset', 'textdomain' ); ?></a>

					<?php foreach($taxonomies as $tax) :
						// get the full taxonomy object
						$full_tax = get_taxonomy( $tax ); ?>
						<div class="dropdown-filter tax-<?php echo esc_attr( $tax ); ?>">
							<button class="menu-active dropdown-toggle" type="button" id="dropdownMenuButton-<?php echo esc_attr( $tax ); ?>">
								<?php echo esc_html( $full_tax->labels->name ); ?>
							</button>

							<div class="dropdown-menu" id="dropdownMenu-<?php echo esc_attr( $tax ); ?>">
								<?php
								$terms = get_terms( array(
									'taxonomy' => $tax,
									'hide_empty' => false
								) );
								foreach ( $terms as $term ) : ?>
									<div class="dropdown-item">
										<input type="checkbox" id="filter-<?php echo esc_attr( $tax ); ?>-<?php echo esc_attr( $term->term_id ); ?>" class="filter-checkbox" value="<?php echo esc_attr( $term->term_id ); ?>">
										<label for="filter-<?php echo esc_attr( $tax ); ?>-<?php echo esc_attr( $term->term_id ); ?>"><?php echo esc_html( $term->name ); ?></label>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
			<h3><?php echo esc_html( $atts['post_type'] ); ?></h3>
			<p>This is the content for the <?php echo esc_html( $atts['post_type'] ); ?> filter.</p>
		</div>

		<script>
			document.addEventListener('DOMContentLoaded', function() {
				var dropdownToggles = document.querySelectorAll('.dropdown-toggle');
				dropdownToggles.forEach(function(toggle) {
					toggle.addEventListener('click', function() {
						var menuId = this.getAttribute('id').replace('Button', '');
						var menu = document.getElementById(menuId);

						// Close all dropdowns except the one being toggled
						var dropdowns = document.querySelectorAll('.dropdown-menu');
						dropdowns.forEach(function(dropdown) {
							if (dropdown !== menu && dropdown.classList.contains('show')) {
								dropdown.classList.remove('show');
							}
						});

						// Toggle the clicked dropdown
						menu.classList.toggle('show');
					});
				});

				document.addEventListener('click', function(event) {
					if (!event.target.matches('.dropdown-toggle')) {
						var dropdowns = document.querySelectorAll('.dropdown-menu');
						dropdowns.forEach(function(dropdown) {
							if (dropdown.classList.contains('show')) {
								dropdown.classList.remove('show');
							}
						});
					}
				});

				// Prevent dropdown from closing when clicking on checkboxes or labels
				var checkboxes = document.querySelectorAll('.filter-checkbox');
				checkboxes.forEach(function(checkbox) {
					checkbox.addEventListener('click', function(event) {
						event.stopPropagation();
					});
				});

				var labels = document.querySelectorAll('.dropdown-item label');
				labels.forEach(function(label) {
					label.addEventListener('click', function(event) {
						event.stopPropagation();
					});
				});
			});
		</script>
		<style>
			.dropdown-filter {
				position: relative;
				display: inline-block;
			}
			.dropdown-toggle {
				background-color: #007bff;
				color: white;
				padding: 10px;
				border: none;
				cursor: pointer;
			}
			.dropdown-menu {
				display: none;
				position: absolute;
				top: 100%; /* Position below the toggle button */
				left: 0;
				background-color: white;
				box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
				z-index: 1;
			}
			.dropdown-menu.show {
				display: block;
			}
			.dropdown-item {
				padding: 10px;
				cursor: pointer;
			}
			.dropdown-item:hover {
				background-color: #f1f1f1;
			}
		</style>
		<?php
		$content = ob_get_clean();
		return $content;
	}

	// filter ajax
	public function mbird_filter_ajax() {
		$posts = get_posts( array(
			'post_type' => 'post',
			'posts_per_page' => -1
		) );

		$response = array();
		foreach ( $posts as $post ) {
			$response[] = array(
				'id' => $post->ID,
				'title' => $post->post_title,
				'content' => $post->post_content
			);
		}

		wp_send_json( $response );
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
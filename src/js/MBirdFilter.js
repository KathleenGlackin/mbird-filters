class MBirdFilter {
	constructor() {
		this.filterFormData = jQuery('#mbird-filter-form').serialize();
		this.currentPage = 1;
		this._init();
	}

	_init() {
		// prevent form submission
		jQuery('#mbird-filter-form').on('submit', (event) => {
			event.preventDefault();
		});

		// on form change run the filters
		jQuery('#mbird-filter-form').on('change', (event) => {
			event.preventDefault();

			this._runFilters();
		});

		// Load initial data
		this._loadData();

		// Add event listener for Load More button
		jQuery('#mbird-load-more').on('click', (event) => {
			event.preventDefault();
			this.currentPage++;
			this._loadData();
		});
	}

	_loadData() {
		jQuery("#mbird-filter-loader").show();

		const shortcodeAtts = jQuery('input[name="shortcode_atts"]').val();

		jQuery.ajax({
			url: mbirdFilters.ajaxurl, // use localized ajaxurl
			type: 'POST',
			data: {
				action: 'mbird_initial_load',
				security: jQuery('#mbird_filter_nonce_field').val(),
				shortcode_atts: shortcodeAtts,
				page: this.currentPage // Include current page in the request
			},
			success: function(response) {
				// if there are posts to display, append them to the list
				if(response) {
					jQuery('#mbird-filter-results').append(response);
				} else {
					// if no more posts, remove the button and show no more posts text
					jQuery('#mbird-load-more').remove();
					jQuery('#mbird-filter-results').html('<p class="no-results">No posts found.</p>');
				}
			},
			error: function(xhr, status, error) {
				console.error('AJAX error:', status, error);
			},
			complete: () => {
				jQuery('#mbird-filter-loader').hide();
			}
		});
	}

	_runFilters() {
		const filterData = jQuery('#mbird-filter-form').serializeArray();
		let shortcodeAtts = JSON.parse(jQuery('input[name="shortcode_atts"]').val());

		// Reset terms in tax_query
		Object.keys(shortcodeAtts.tax_query).forEach(key => {
			if (Array.isArray(shortcodeAtts.tax_query[key].terms)) {
				shortcodeAtts.tax_query[key].terms = [];
			}
		});

		filterData.forEach(item => {
			if (item.name.startsWith('filter-')) {
				const key = item.name.replace('filter-', '');
				Object.keys(shortcodeAtts.tax_query).forEach(taxKey => {
					if (shortcodeAtts.tax_query[taxKey].taxonomy === key) {
						shortcodeAtts.tax_query[taxKey].terms.push(item.value);
					}
				});
			}
		});

		jQuery('input[name="shortcode_atts"]').val(JSON.stringify(shortcodeAtts));

		console.log(jQuery('input[name="shortcode_atts"]').val());

		this.currentPage = 1; // Reset to the first page
		jQuery('#mbird-filter-results').empty(); // Clear previous results
		this._loadData();
	}
}
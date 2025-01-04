class MBirdFilter {
	constructor() {
		this.filterFormData = jQuery('#mbird-filter-form').serialize();
		this.currentPage = 1;
		this.postsPerPage = 9; // Set this to match the posts_per_page value in the shortcode
		this.totalPosts = 0;
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

		// Check for URL parameters and set filter options if present
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.toString()) {
			this._setFiltersFromUrl();
		} else {
			// Load initial data if no URL parameters are present
			this._loadData();
		}

		// Add event listener for Load More button
		jQuery('#mbird-load-more').on('click', (event) => {
			event.preventDefault();
			this.currentPage++;
			this._loadData();
		});

		// add event listener for reset button
		jQuery('#mbird-filter-reset').on('click', (event) => {
			event.preventDefault();
			this._resetFilters();
		});
	}

	_setFiltersFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);

		urlParams.forEach((value, key) => {
			const filterElement = jQuery(`#filter-${key}-${value}`);
			if (filterElement.length) {
				filterElement.prop('checked', true);
			}
		});

		// Apply filters based on URL parameters
		this._runFilters();
	}

	_loadData() {
		jQuery("#mbird-filter-loader").show();

		const shortcodeAtts = jQuery('input[name="shortcode_atts"]').val();

		jQuery.ajax({
			url: mbirdFilters.ajaxurl, // use localized ajaxurl
			type: 'POST',
			data: {
				action: 'mbird_load',
				security: jQuery('#mbird_filter_nonce_field').val(),
				shortcode_atts: shortcodeAtts,
				page: this.currentPage // Include current page in the request
			},
			success: (response) => {
				// if there are posts to display, append them to the list
				if(response.content) {
					jQuery('#mbird-filter-results').append(response.content);

					// Update total number of posts
					this.totalPosts = response.total;
					const totalPostsElement = jQuery('#total-posts');
					totalPostsElement.text(`${response.total}`);

					// Check if there are more posts to load
					const loadedPosts = jQuery('#mbird-filter-results .post-item').length;
					if (loadedPosts < this.totalPosts) {
						jQuery('#mbird-load-more').show();
					} else {
						jQuery('#mbird-load-more').hide();
					}
				} else {
					// if no more posts, remove the button and show no more posts text
					jQuery('#mbird-load-more').hide();
					jQuery('#mbird-filter-results').html('<p class="no-results">No posts found.</p>');

					// Update total number of posts to 0
					const totalPostsElement = jQuery('#total-posts');
					totalPostsElement.text('0');
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

		const urlParams = new URLSearchParams(window.location.search);
		const taxonomyParams = {};
		const selectedFilters = [];

		// Clear existing filter parameters from URL
		Object.keys(shortcodeAtts.tax_query).forEach(key => {
			const taxonomy = shortcodeAtts.tax_query[key].taxonomy;
			urlParams.delete(taxonomy);
		});

		filterData.forEach(item => {
			if (item.name.startsWith('filter-')) {
				const key = item.name.replace('filter-', '');
				Object.keys(shortcodeAtts.tax_query).forEach(taxKey => {
					if (shortcodeAtts.tax_query[taxKey].taxonomy === key) {
						shortcodeAtts.tax_query[taxKey].terms.push(item.value);
					}
				});
				if (!taxonomyParams[key]) {
					taxonomyParams[key] = [];
				}
				taxonomyParams[key].push(item.value);

				// Add selected filter to the list
				const label = '<span class="item" data-filter="filter-'+`${key}-${item.value}`+'">'+jQuery(`label[for="filter-${key}-${item.value}"]`).text()+'<small>x</small></span>';

				selectedFilters.push(`${label}`);
			}
		});

		// Update the URL with the new parameters
		Object.keys(taxonomyParams).forEach(key => {
			urlParams.set(key, taxonomyParams[key].join(','));
		});
		const newUrl = decodeURIComponent(`${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`);
		history.pushState(null, '', newUrl);

		// update shortcode_atts with the new filters
		jQuery('input[name="shortcode_atts"]').val(JSON.stringify(shortcodeAtts));

		 // Preserve the #no-remove element and update the selected filters
		const noRemoveElement = jQuery('#no-remove').detach();
		jQuery('#selected-filters').html(selectedFilters);
		jQuery('#selected-filters').append(noRemoveElement);

		// Add event listener to remove selected filters
		jQuery('#selected-filters .item small').on('click', (event) => {
			const filter = jQuery(event.target).closest('.item').data('filter');
			jQuery(`#${filter}`).prop('checked', false);
			this._runFilters();
		});

		this.currentPage = 1; // Reset to the first page
		jQuery('#mbird-filter-results').empty(); // Clear previous results
		this._loadData();
	}

	_resetFilters() {
		let shortcodeAtts = JSON.parse(jQuery('input[name="shortcode_atts"]').val());

		// Clear only the terms in tax_query
		Object.keys(shortcodeAtts.tax_query).forEach(key => {
			if (Array.isArray(shortcodeAtts.tax_query[key].terms)) {
				shortcodeAtts.tax_query[key].terms = [];
			}
		});

		// Update the URL to remove filter parameters
		const urlParams = new URLSearchParams(window.location.search);
		Object.keys(shortcodeAtts.tax_query).forEach(key => {
			const taxonomy = shortcodeAtts.tax_query[key].taxonomy;
			urlParams.delete(taxonomy);
		});
		const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
		history.pushState(null, '', newUrl);

		jQuery('input[name="shortcode_atts"]').val(JSON.stringify(shortcodeAtts));
		jQuery('#mbird-filter-form')[0].reset();
		this.currentPage = 1;
		jQuery('#mbird-filter-results').empty();

		// Preserve the #no-remove element and clear selected filters
		const noRemoveElement = jQuery('#no-remove').detach();
		jQuery('#selected-filters').empty();
		jQuery('#selected-filters').prepend(noRemoveElement);

		this._loadData();
	}
}
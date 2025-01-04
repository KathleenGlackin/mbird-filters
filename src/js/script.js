class MBirdFilter {
	constructor(startParam, type, filterAction, countAction, taxCountAction) {
		this.filterFormData = jQuery('#mbird-filter-form').serialize();

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

			// this._runFilters();
		});

		this._loadData();
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
				shortcode_atts: shortcodeAtts
			},
			success: function(response) {
				console.log('AJAX response:', response);

				jQuery('#mbird-filter-results').append(response);
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
		const filterData = jQuery('#mbird-filter-form').serialize();

		jQuery.ajax({
			url: mbirdFilters.ajaxurl, // use localized ajaxurl
			type: 'POST',
			data: {
				action: 'mbird_filter',
				security: jQuery('#mbird_filter_nonce_field').val(),
				terms: filterData
			},
			success: function(response) {
				console.log('AJAX response:', response);
			},
			error: function(xhr, status, error) {
				console.error('AJAX error:', status, error);
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', function() {
	const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
	dropdownToggles.forEach(function(toggle) {
		toggle.addEventListener('click', function() {
			const menuId = this.getAttribute('id').replace('Button', '');
			const menu = document.getElementById(menuId);
			const menuIcon = this.querySelector('.arrow');

			// Close all dropdowns except the one being toggled
			const dropdowns = document.querySelectorAll('.dropdown-menu');
			dropdowns.forEach(function(dropdown) {
				if (dropdown !== menu && dropdown.classList.contains('show')) {
					dropdown.classList.remove('show');

					document.querySelectorAll('.mbird-filter .arrow').forEach((element) => {
						element.classList.remove('open');
					});
				}
			});

			// Toggle the clicked dropdown
			menu.classList.toggle('show');
			menuIcon.classList.toggle('open');
		});
	});

	document.addEventListener('click', function(event) {
		if (!event.target.matches('.dropdown-toggle')) {
			const dropdowns = document.querySelectorAll('.dropdown-menu');
			dropdowns.forEach(function(dropdown) {

				if (dropdown.classList.contains('show')) {
					dropdown.classList.remove('show');
					document.querySelectorAll('.mbird-filter .arrow').forEach((element) => {
						element.classList.remove('open');
					});
				}
			});
		}
	});

	// prevent dropdown from closing when clicking on checkboxes or labels
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
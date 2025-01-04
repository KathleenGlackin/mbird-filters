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
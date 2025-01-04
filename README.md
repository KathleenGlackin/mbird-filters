# Mockingbird Filters

Mockingbird Filters is a WordPress plugin that provides a collection of filters for the Mockingbird theme. It allows users to filter posts based on various taxonomies and display the results dynamically using AJAX.

## Features

- Filter posts by multiple taxonomies
- AJAX-based filtering for a seamless user experience
- Pagination with a "Load More" button
- Customizable filter layout

## Installation

1. Download the plugin files and upload them to the `/wp-content/plugins/mbird-filters` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.

## Usage

### Shortcode

To use the Mockingbird Filters plugin, add the following shortcode to any post or page:

```php
[mbird_filter post_type="post" filters="category,tag" order="ASC" orderby="name" posts_per_page="9"]
```

#### Shortcode Attributes

- `post_type` (string) - The post type to filter. Default is `post`.
- `filters` (string) - A comma-separated list of taxonomies to filter by. Example: `category,tag`.
- `order` (string) - The order of the posts. Accepts `ASC` or `DESC`. Default is `ASC`.
- `orderby` (string) - The field to order the posts by. Default is `name`.
- `posts_per_page` (int) - The number of posts to display per page. Default is `9`.

### Example

```php
[mbird_filter post_type="grant-recipient" filters="grant_category,grant-type,state" order="ASC" orderby="name" posts_per_page="10"]
```

### Customization

You can customize the filter layout by modifying the SCSS files located in the `src/scss` directory. After making changes, compile the SCSS files using Gulp.

### Gulp Tasks

The plugin includes Gulp tasks for compiling SCSS and minifying JavaScript files. To use Gulp, follow these steps:

1. Install Node.js and npm.
2. Navigate to the plugin directory and run `npm install` to install the dependencies.
3. Use the following Gulp commands:

- `gulp` - Default task that watches for changes and compiles SCSS and JS files.
- `gulp build` - Compiles SCSS and JS files for production.

### AJAX Endpoints

The plugin uses the following AJAX endpoints:

- `mbird_initial_load` - Loads the initial set of posts based on the shortcode attributes.
- `mbird_filter` - Filters the posts based on the selected taxonomy terms.

### Template Customization

You can customize the post template by modifying the `templates/content-post.php` file. This file controls the layout of each post in the filter results.

### Troubleshooting

If you encounter any issues, check the following:

- Ensure that the plugin is activated.
- Verify that the shortcode attributes are correct.
- Check the browser console for any JavaScript errors.
- Review the PHP error log for any server-side errors.

### Support

For support and inquiries, please contact [Kathleen Glackin](https://kathleenglackin.com).

### License

This plugin is licensed under the [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html).

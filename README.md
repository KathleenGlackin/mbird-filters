# Mockingbird Filters

Mockingbird Filters is a WordPress plugin that provides a collection of filters for the Mockingbird theme. It allows users to filter posts based on various taxonomies and display the results dynamically using AJAX.

## Features

- Filter posts by multiple taxonomies
- AJAX-based filtering for a seamless user experience
- Pagination with a "Load More" button

## Installation

1. Download the plugin files and upload them to the `/wp-content/plugins/mbird-filters` directory.
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
[mbird_filter post_type="grant-recipient" filters="grant-type,grant_category,state" order="ASC" orderby="name" posts_per_page="10"]
```

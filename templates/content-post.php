<article class="ymc-post-custom-layout post-<?php the_ID(); ?> post-item">
	<div class="table-data-wrap">
		<div class="grant-recipient-col">
			<h2><?php the_title(); ?></h2>

			<?php
			$grant_recipient_state_terms = wp_get_post_terms(get_the_ID(), 'state');
			if ($grant_recipient_state_terms && !is_wp_error($grant_recipient_state_terms)) {
				$state_name = $grant_recipient_state_terms[0]->name;
			} ?>

			<p><?php the_field('grant_recipient_city'); ?>, <?php echo $state_name; ?></p>

			<div class="buttons-wrap">
				<?php if(get_field('grant_recipient_website')) : ?>
					<div class="wp-block-uagb-buttons-child uagb-buttons__outer-wrap uagb-block-b5b19233 wp-block-button">
						<div class="uagb-button__wrapper">
							<a class="uagb-buttons-repeater wp-block-button__link" aria-label="website" href="<?php the_field('grant_recipient_website'); ?>" rel="follow noopener" target="_blank">
								<div class="uagb-button__link">website</div>
							</a>
						</div>
					</div>
				<?php endif;
				
				if(get_field('grant_press')) : ?>
					<div class="wp-block-uagb-buttons-child uagb-buttons__outer-wrap uagb-block-ee6f62c0 wp-block-button">
						<div class="uagb-button__wrapper">
							<a class="uagb-buttons-repeater wp-block-button__link" aria-label="" href="<?php the_field('grant_press'); ?>" rel="follow noopener">
								<div class="uagb-button__link">press release</div>
							</a>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<div class="grant-amount-col">
			<p class="grant-amount-label"><?php the_field('grant_amount'); ?></p>
		</div>

		<div class="grant-type-col">
			<?php
			$grant_type_terms = wp_get_post_terms(get_the_ID(), 'grant-type');
			if ($grant_type_terms && !is_wp_error($grant_type_terms)) :
				$grant_type_name = $grant_type_terms[0]->name; ?>
				<p class="grant-type-label"><?php echo $grant_type_name; ?></p>
			<?php endif; ?>
		</div>

		<div class="grant-category-col">
			<?php
			$grant_category_terms = wp_get_post_terms(get_the_ID(), 'grant_category');
			if ($grant_category_terms && !is_wp_error($grant_category_terms)) :
				$grant_category_name = $grant_category_terms[0]->name; ?>
				<p class="grant-cat-label"><?php echo $grant_category_name; ?></p>
			<?php endif; ?>
		</div>

		<div class="grant-year-col">
			<p class="grant-type-year"><?php the_field('grant_year'); ?></p>
		</div>
	</div>
</article>

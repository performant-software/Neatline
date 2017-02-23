<?php $view = get_view(); ?>
<fieldset>
<legend><?php echo __('Google Maps API Settings'); ?></legend>

<div class="field">
    <div class="two columns alpha">
        <label for="api_key"><?php echo __('API Key'); ?></label>
    </div>
    <div class="inputs five columns omega">
        <p class="explanation">
            <?php
            echo __('Google Maps API key for Neatline. For more information, see %s.',
                '<a target="_blank" href="https://developers.google.com/maps/web/">developers.google.com/maps/web</a>'
            );
            ?>
        </p>
        <?php echo $view->formText('neatline_googlemaps_apikey', get_option('neatline_googlemaps_apikey')); ?>
    </div>
</div>
</fieldset>

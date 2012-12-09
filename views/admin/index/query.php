<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Items query form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */
?>

<?php
$title = __('Neatline | Edit Items Query');
echo head(array('content_class' => 'neatline', 'title' => $title));
?>

<div id="primary">
    <?php echo items_search_form(array(), current_url()); ?>
</div>

<?php echo foot(); ?>

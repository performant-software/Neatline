<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Create exhibit.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php
queue_js_file('slugBuilder');
queue_js_file('_constructAdd');
?>

<?php
$title = __('Neatline | Create an Exhibit');
echo head(array('content_class' => 'neatline', 'title' => $title));
?>

<div id="primary">
    <?php echo flash(); ?>
    <?php echo $form; ?>
</div>

<script>
jQuery(document).ready(function($){
    Omeka.wysiwyg();
});
</script>

<?php echo foot(); ?>

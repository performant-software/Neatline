<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php echo head(array('title' => nl_getExhibitField('title'))); ?>

<!-- Exhibit. -->
<?php echo nl_getExhibitMarkup(); ?>

<!-- Description. -->
<div class="exhibit-description">
    <?php echo nl_getExhibitField('description'); ?>
</div>

<?php echo foot(); ?>

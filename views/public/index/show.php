<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Public exhibit show.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */
?>

<?php neatline_queueNeatlineAssets(get_current_neatline()); ?>
<?php echo head(array('title' => neatline('title'))); ?>

<!-- The core Neatline partial. -->
<?php echo $this->partial('neatline/_neatline.php', array(
    'exhibit' => get_current_neatline()
)); ?>

<div class="exhibit-description">
    <?php echo neatline('description'); ?>
</div>

<?php echo foot(); ?>

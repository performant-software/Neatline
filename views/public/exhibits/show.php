<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php echo head(array(
  'title' => nl_getExhibitField('title')
)); ?>

<!-- Title. -->
<h1><?php echo nl_getExhibitField('title'); ?></h1>

<!-- Exhibit. -->
<?php echo nl_getExhibitMarkup(); ?>

<!-- Narrative. -->
<?php echo nl_getNarrativeMarkup(); ?>

<?php echo foot(); ?>

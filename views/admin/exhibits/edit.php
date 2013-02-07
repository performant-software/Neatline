<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Edit exhibit.
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
  echo head(array(
    'title' => __('Neatline | Edit "%s"', _nl_field('title')),
    'content_class' => 'neatline'
  ));
?>

<div id="primary">
  <?php echo flash(); ?>
  <?php echo $form; ?>
</div>

<?php echo foot(); ?>

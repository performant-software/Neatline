<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record temporal pane.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="control-group">

  <?php echo common('neatline/input', array(
      'name'  => 'start-date',
      'label' => 'Start Date',
      'bind'  => 'record.start_date'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'end-date',
      'label' => 'End Date',
      'bind'  => 'record.end_date'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'start-show-date',
      'label' => 'Start Show Date',
      'bind'  => 'record.start_show_date'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'end-show-date',
      'label' => 'End Show Date',
      'bind'  => 'record.end_show_date'
  )); ?>

</div>

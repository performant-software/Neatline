<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="control-group">

  <?php echo common('neatline/input', array(
      'name'  => 'item-id',
      'label' => 'Omeka ID',
      'bind'  => 'record.item_id',
      'placeholder' => 'Search Omeka Items'
  )); ?>

  <?php echo common('neatline/textarea', array(
      'id'    => 'title',
      'name'  => 'title',
      'label' => 'Title',
      'bind'  => 'record.title',
      'editHtml' => 'title'
  )); ?>

  <?php echo common('neatline/textarea', array(
      'id'    => 'body',
      'name'  => 'body',
      'label' => 'Body',
      'bind'  => 'record.body',
      'editHtml' => 'body'
  )); ?>

</div>

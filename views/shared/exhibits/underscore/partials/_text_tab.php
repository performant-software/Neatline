<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Text tab template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<div class="control-group">

  <?php echo $this->partial(
    'exhibits/underscore/helpers/_text_input.php', array(
      'name'  => 'item-id',
      'label' => 'Omeka Id',
      'bind'  => 'record.item_id'
  )); ?>

  <!--
  <?php echo $this->partial(
    'exhibits/underscore/helpers/_text_input.php', array(
      'name'  => 'slug',
      'label' => 'Slug',
      'bind'  => 'record.slug'
  )); ?>
  -->

  <?php echo $this->partial(
    'exhibits/underscore/helpers/_textarea.php', array(
      'name'  => 'title',
      'label' => 'Title',
      'bind'  => 'record.title'
  )); ?>

  <?php echo $this->partial(
    'exhibits/underscore/helpers/_textarea.php', array(
      'name'  => 'body',
      'label' => 'Body',
      'bind'  => 'record.body'
  )); ?>

</div>

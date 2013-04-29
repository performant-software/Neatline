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
      'bind'  => 'record.title'
  )); ?>

  <?php echo common('neatline/textarea', array(
      'id'    => 'body',
      'name'  => 'body',
      'label' => 'Body',
      'bind'  => 'record.body'
  )); ?>

  <!-- TODO|dev -->
  <div id="body-toolbar" class="wysihtml5">

    <a data-wysihtml5-command="bold" title="CTRL+B">Bold</a> •
    <a data-wysihtml5-command="italic" title="CTRL+I">Italic</a> •
    <a data-wysihtml5-command="underline" title="CTRL+U">Underline</a> •
    <a data-wysihtml5-command="createLink">Insert link</a> •
    <a data-wysihtml5-command="insertImage">Insert image</a> •
    <a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1">h1</a> •
    <a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h2">h2</a> •
    <a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h3">h3</a> •
    <a data-wysihtml5-command="insertUnorderedList">Unordered List</a> •
    <a data-wysihtml5-command="insertOrderedList">Ordered List</a> •
    <a data-wysihtml5-command="removeFormat">Clear Formatting</a> •
    <a data-wysihtml5-action="change_view">Edit HTML</a>

    <div data-wysihtml5-dialog="createLink" style="display: none;">
      <label>URL: <input data-wysihtml5-dialog-field="href" value="http://"></label>
      <a data-wysihtml5-dialog-action="save">OK</a> <a data-wysihtml5-dialog-action="cancel">Cancel</a>
    </div>

    <div data-wysihtml5-dialog="insertImage" style="display: none;">
      <label>Image URL: <input data-wysihtml5-dialog-field="src" value="http://"></label>
      <a data-wysihtml5-dialog-action="save">OK</a>&nbsp;<a data-wysihtml5-dialog-action="cancel">Cancel</a>
    </div>

  </div>

</div>

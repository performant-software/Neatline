<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Back/Save/Delete buttons for edit form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="actions">

  <a name="save" class="btn btn-large btn-primary" \>
    <i class="icon-ok icon-white"></i> <?php echo __('Save'); ?>
  </a>

  <a href="#deleteConfirm" name="delete"
    class="btn btn-large btn-inverse" data-toggle="modal">
      <i class="icon-trash icon-white"></i> <?php echo __('Delete'); ?>
  </a>

</div>

<div id="deleteConfirm" class="modal hide" role="dialog"
  aria-hidden="true">

  <div class="modal-header">
    <h4>Are you sure?</h4>
  </div>

  <div class="modal-body">
    <p>This will completely delete the record from the database and remove
       all associated metadata. This action cannot be undone.
    </p>
  </div>

  <div class="modal-footer">

    <button name="delete" class="btn btn-danger">
      <i class="icon-trash icon-white"></i> Yes, delete
    </button>

    <button class="btn" data-dismiss="modal">
      <i class="icon-ban-circle"></i> Cancel
    </button>

  </div>

</div>

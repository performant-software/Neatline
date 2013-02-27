<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record delete modal.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div id="delete-modal" class="modal hide">

  <div class="modal-header">
    <h4>Are you sure?</h4>
  </div>

  <div class="modal-body">
    <p><?php echo $warning; ?></p>
  </div>

  <div class="modal-footer">

    <a name="cancel" class="btn" data-dismiss="modal">
      <i class="icon-ban-circle"></i> Cancel
    </a>

    <a name="delete2" class="btn btn-danger">
      <i class="icon-trash icon-white"></i> Yes, delete
    </a>

  </div>

</div>

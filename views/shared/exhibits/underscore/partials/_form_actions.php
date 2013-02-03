<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Save/Delete buttons for recrord edit form.
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

  <a
    href="#delete-modal"
    name="delete1"
    class="btn btn-large btn-inverse"
    data-toggle="modal"
  ><i class="icon-trash icon-white"></i> <?php echo __('Delete'); ?></a>

</div>

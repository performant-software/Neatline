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

<ul class="pager">
  <li>
    <a name="close" class="btn btn-link" \>
      <i class="icon-arrow-left"></i>
      <?php echo __('Back'); ?>
    </a>
  </li>
  <li>
    <a name="save" class="btn btn-link" \>
      <i class="icon-ok-circle"></i>
      <?php echo __('Save'); ?>
    </a>
  </li>
  <li>
    <a name="delete" class="btn btn-link">
      <i class="icon-trash"></i>
      <?php echo __('Delete'); ?>
    </a>
  </li>
</ul>

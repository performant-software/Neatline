<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor menu.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="styles-template" type="text/templates">

  <div class="control-group">
    <div class="controls">
      <textarea id="styles" rows="26"><?php echo $styles; ?></textarea>
    </div>
  </div>

  <a name="save" class="btn btn-large btn-primary" \>
    <i class="icon-ok icon-white"></i> <?php echo __('Save'); ?>
  </a>

</script>

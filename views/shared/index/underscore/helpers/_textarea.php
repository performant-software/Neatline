<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bootstrap textarea.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<div class="control-group">
  <label for="<?php echo $name; ?>">
    <?php echo __($label); ?>
  </label>
  <div class="controls">
    <textarea name="<?php echo $name; ?>"
      data-value="<?php echo $bind; ?>">
    </textarea>
  </div>
</div>

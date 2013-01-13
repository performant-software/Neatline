<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bootstrap text input.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<label><?php echo __($label); ?></label>
<div class="controls">
  <div class="inline-inputs">
    <input type="text" name="<?php echo $name; ?>"
      data-value="<?php echo $bind; ?>"/>
  </div>
</div>

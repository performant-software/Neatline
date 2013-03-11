<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Ace editor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="controls">
  <div class="inline-inputs">
    <a class="btn btn-small"
      <?php if (isset($name)) echo "name='$name'"; ?>>
      <i <?php if (isset($icon)) echo "class='$icon'"; ?>></i>
      <?php echo $text; ?>
    </a>
  </div>
</div>

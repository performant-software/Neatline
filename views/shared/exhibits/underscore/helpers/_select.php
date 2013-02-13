<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bootstrap dropdown select.
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
    <select
      <?php if (isset($name)) echo "name='$name'"; ?>
      <?php if (isset($class)) echo "class='$class'"; ?>
      <?php if (isset($bind)) echo "data-value='$bind'"; ?>
    >
      <?php foreach ($options as $label => $val): ?>
        <option value="<?php echo $val; ?>">
          <?php echo $label; ?>
        </option>
      <?php endforeach; ?>
    </select>
  </div>
</div>

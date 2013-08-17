<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="form-group">

  <label>

    <!-- Label text. -->
    <?php echo __($label); ?>

    <!-- ( Use Current ). -->
    <?php if (isset($useCurrent) && $useCurrent): ?>
      ( <a class="label-link" name="set-<?php echo $name; ?>">
        <?php echo __('Use Current'); ?>
        </a> )
    <?php endif; ?>

  </label>

  <input
    type="<?php echo isset($type) ? $type : 'text'; ?>"
    class="form-control <?php if (isset($class)) echo $class; ?>"
    <?php if (isset($placeholder)) echo "placeholder='$placeholder'"; ?>
    <?php if (isset($name)) echo "name='$name'"; ?>
    <?php if (isset($bind)) echo "data-rv-value='$bind'"; ?>
    <?php if (isset($value)) echo "value='$value'"; ?>
  />

</div>

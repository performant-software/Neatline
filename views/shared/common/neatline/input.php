<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<label>
  <?php echo __($label); ?>
  <?php if (isset($style)): ?>
    <code><?php echo $style; ?></code>
  <?php endif; ?>
</label>

<?php if (isset($useCurrent) && $useCurrent): ?>
  ( <a class="use-current" name="set-<?php echo $name; ?>">
      Use Current
    </a> )
<?php endif; ?>

<div class="controls">
  <div class="inline-inputs">
    <input
      type="<?php echo isset($type) ? $type : 'text'; ?>"
      <?php if (isset($placeholder)) echo "placeholder='$placeholder'"; ?>
      <?php if (isset($name)) echo "name='$name'"; ?>
      <?php if (isset($class)) echo "class='$class'"; ?>
      <?php if (isset($bind)) echo "data-value='$bind'"; ?>
      <?php if (isset($value)) echo "value='$value'"; ?>
    />
  </div>
</div>

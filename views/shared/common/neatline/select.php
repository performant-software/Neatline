<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="form-group">

  <label>

    <?php echo __($label); ?>

    <!-- Help modal link. -->
    <?php echo common('neatline/help', array('name' => $name)); ?>

  </label>

  <select

    class="form-control <?php echo @$class; ?>"

    <?php if (isset($name)): ?>
      name="<?php echo $name; ?>"
    <?php endif; ?>

    <?php if (isset($multi) && $multi): ?>
      multiple="multiple"
    <?php endif; ?>

    <?php if (isset($bind)): ?>
      rv-value="<?php echo $bind; ?>"
    <?php endif; ?>

  >

    <?php foreach ($options as $label => $val): ?>
      <option value="<?php echo $val; ?>">
        <?php echo $label; ?>
      </option>
    <?php endforeach; ?>

  </select>

</div>

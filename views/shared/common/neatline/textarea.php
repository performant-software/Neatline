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

    <?php echo __($label); ?>

    <!-- ( Edit HTML ). -->
    <?php if (isset($editHtml)): ?>
      ( <a class="label-link" data-textarea="<?php echo $editHtml; ?>">
          Edit HTML
        </a> )
    <?php endif; ?>

  </label>

  <textarea
    class="form-control <?php if (isset($class)) echo $class; ?>"
    <?php if (isset($id)) echo "id='$id'"; ?>
    <?php if (isset($name)) echo "name='$name'"; ?>
    <?php if (isset($bind)) echo "data-rv-value='$bind'"; ?>
  ></textarea>

</div>

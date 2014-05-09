<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="form-group">

  <label>

    <?php echo __($label); ?>

    <!-- "Edit HTML" link. -->
    <?php if (isset($editHtml)): ?>
      ( <a class="label-link" data-textarea="<?php echo $editHtml; ?>">
          Edit HTML
        </a> )
    <?php endif; ?>

    <!-- Help modal link. -->
    <?php if (isset($modal)): ?>
      <?php echo common('neatline/help', array(
        'modal' => $modal, 'text' => '?'
      )); ?>
    <?php endif; ?>

  </label>

  <textarea

    class="form-control <?php echo @$class; ?>"

    <?php if (isset($id)): ?>
      id="<?php echo $id; ?>"
    <?php endif; ?>

    <?php if (isset($bind)): ?>
      rv-value="<?php echo $bind; ?>"
    <?php endif; ?>

    <?php if (isset($name)): ?>
      name="<?php echo $name; ?>"
    <?php endif; ?>

  ></textarea>

</div>

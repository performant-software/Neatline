<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!-- Delete confirmation. -->
<div id="delete-modal" class="modal" role="dialog" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">

      <div class="modal-header">
        <h4><?php echo __('Are you sure?'); ?></h4>
      </div>

      <div class="modal-body">
        <p>
          <?php echo __(
            'This will delete the record from the database and remove all
            associated metadata. This action cannot be undone.'
          );?>
        </p>
      </div>

      <div class="modal-footer">

        <a name="cancel" class="btn btn-default" data-dismiss="modal">
          <?php echo __('Cancel'); ?>
        </a>

        <a name="delete" class="btn btn-danger">
          <?php echo __('Yes, delete'); ?>
        </a>

      </div>

    </div>
  </div>
</div>

<!-- SVG import. -->
<div id="svg-modal" class="modal" role="dialog" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">

      <div class="modal-header">
        <h4><?php echo __('Enter SVG'); ?></h4>
      </div>

      <div class="modal-body">

        <?php echo common('neatline/textarea', array(
            'name'  => 'svg',
            'label' => 'SVG',
            'class' => 'code'
        )); ?>

        <?php echo common('neatline/input', array(
            'name'  => 'density',
            'label' => 'Density',
            'value' => '1.0'
        )); ?>

      </div>

      <div class="modal-footer">

        <a name="cancel" class="btn btn-default" data-dismiss="modal">
          <?php echo __('Cancel'); ?>
        </a>

        <a name="parse" class="btn btn-primary">
          <?php echo __('Parse'); ?>
        </a>

      </div>

    </div>
  </div>
</div>

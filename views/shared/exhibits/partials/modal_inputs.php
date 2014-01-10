<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php foreach (nl_getInputDocs() as $name => $markdown): ?>

  <div id="docs-modal-<?php echo $name; ?>" class="modal" role="dialog"
    aria-hidden="true">

    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-body"><?php echo $markdown; ?></div>

        <div class="modal-footer">
          <a name="close" class="btn btn-default" data-dismiss="modal">
            <?php echo __('Close'); ?>
          </a>
        </div>

      </div>
    </div>

  </div>

<?php endforeach; ?>

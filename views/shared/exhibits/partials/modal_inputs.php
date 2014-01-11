<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php foreach (nl_getInputModals() as $name => $markdown): ?>

  <div id="docs-modal-<?php echo $name; ?>" class="modal fade" role="dialog">

    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Markdown body. -->
        <div class="modal-body markdown"><?php echo $markdown; ?></div>

        <!-- Close button. -->
        <div class="modal-footer">
          <a name="close" class="btn btn-primary btn-lg" data-dismiss="modal">
            <?php echo __('Got it'); ?>
          </a>
        </div>

      </div>
    </div>

  </div>

<?php endforeach; ?>

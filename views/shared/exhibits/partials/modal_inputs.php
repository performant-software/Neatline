<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
            <?php echo __('Close'); ?>
          </a>
        </div>

      </div>
    </div>

  </div>

<?php endforeach; ?>

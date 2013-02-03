<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form SVG markup modal.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div id="svg-modal" class="modal hide">

  <div class="modal-header">
    <h4>Enter SVG</h4>
  </div>

  <div class="modal-body">
    <textarea name="svg" class="code"></textarea>
  </div>

  <div class="modal-footer">

    <a name="cancel" class="btn" data-dismiss="modal">
      <i class="icon-ban-circle"></i> Cancel
    </a>

    <a name="parse" class="btn btn-primary">
      <i class="icon-ok icon-white"></i> Parse SVG
    </a>

  </div>

</div>

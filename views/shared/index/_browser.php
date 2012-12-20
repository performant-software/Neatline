<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Browser menu and record/tag lists container.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="browser-template" type="text/templates">

  <header>
    <p class="lead"><?php echo $exhibit->title; ?></p>
    <?php echo $this->partial('index/_editor_nav.php'); ?>
  </header>

  <div id="browser"></div>

</script>

<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor menu.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="menu-template" type="text/templates">

  <p class="lead"><?php echo $exhibit->title; ?></p>

  <ul class="nav nav-pills">

    <li class="records">
      <a href="#records">
        <i class="icon-file"></i> Records
      </a>
    </li>

    <li class="styles">
      <a href="#styles">
        <i class="icon-tags"></i> Styles
      </a>
    </li>

  </ul>

</script>

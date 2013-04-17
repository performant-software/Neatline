<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit menu.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="exhibit-menu-template" type="text/templates">

  <p class="lead"><?php echo _nl_exhibit()->title; ?></p>

  <ul class="nav nav-pills">

    <li class="tab" data-slug="records">
      <a href="#records">Records</a>
    </li>
    <li class="tab" data-slug="styles">
      <a href="#styles">Styles</a>
    </li>

    <!-- Widget tabs. -->
    <?php echo $this->partial(
      'exhibits/underscore/_widget_tabs.php'
    ); ?>

  </ul>

</script>

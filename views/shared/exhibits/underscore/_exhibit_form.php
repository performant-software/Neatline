<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="exhibit-form-template" type="text/templates">

  <!-- Exhibit title. -->
  <p class="lead"><?php echo _nl_exhibit()->title; ?></p>

  <ul class="nav nav-pills">

    <!-- Default tabs. -->

    <li class="tab">
      <a href="#records" data-toggle="tab"
        data-slug="records">Records</a>
    </li>
    <li class="tab">
      <a href="#styles" data-toggle="tab"
        data-slug="styles">Records</a>
    </li>

    <!-- TODO: Widget tabs. -->

  </ul>

  <div class="tab-content">

    <!-- Default panels. -->

    <div class="tab-pane records" id="records">
      <?php echo $this->partial(
        'exhibits/underscore/partials/_records.php'
      ); ?>
    </div>

    <div class="tab-pane styles" id="styles">
      <?php echo $this->partial(
        'exhibits/underscore/partials/_styles.php'
      ); ?>
    </div>

    <!-- TODO: Widget panels. -->

  </div>

</script>

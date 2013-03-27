<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="record-form-template" type="text/templates">

  <!-- Close button. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/close_button.php'
  ); ?>

  <!-- Header. -->
  <p class="lead">
    <span class="id" data-text="record.id | id"></span>
    <span class="title" data-text="record.title | title"></span>
  </p>

  <!-- Tabs. -->
  <ul class="nav nav-pills">
    <li class="tab">
      <a href="#record-text" data-toggle="tab"
        data-slug="text">Text</a>
    </li>
    <li class="tab">
      <a href="#record-map" data-toggle="tab"
        data-slug="map">Map</a>
    </li>
    <li class="tab">
      <a href="#record-style" data-toggle="tab"
        data-slug="style">Style</a>
    </li>
  </ul>

  <!-- Panels. -->
  <div class="tab-content">
    <div class="tab-pane text" id="record-text">
      <?php echo $this->partial(
        'exhibits/underscore/partials/pane_text.php'
      ); ?>
    </div>
    <div class="tab-pane spatial" id="record-map">
      <?php echo $this->partial(
        'exhibits/underscore/partials/pane_map.php'
      ); ?>
    </div>
    <div class="tab-pane style" id="record-style">
      <?php echo $this->partial(
        'exhibits/underscore/partials/pane_style.php'
      ); ?>
    </div>
  </div>

  <!-- Save/Delete buttons. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/form_actions.php'
  ); ?>

  <!-- SVG modal. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/svg_modal.php'
  ); ?>

</script>

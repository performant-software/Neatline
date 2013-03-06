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
    'exhibits/underscore/partials/_close_button.php'
  ); ?>

  <p class="lead">
    <span class="id" data-text="record.id | id"></span>
    <span class="title" data-text="record.title | title"></span>
  </p>

  <ul class="nav nav-pills">

    <li class="tab">
      <a href="#record-text" data-toggle="tab"
        data-slug="text">Text</a>
    </li>
    <li class="tab">
      <a href="#record-spatial" data-toggle="tab"
        data-slug="spatial">Spatial</a>
    </li>
    <li class="tab">
      <a href="#record-style" data-toggle="tab"
        data-slug="style">Style</a>
    </li>

    <?php echo $this->partial(
      'exhibits/underscore/partials/_record_plugin_tabs.php'
    ); ?>

  </ul>

  <div class="tab-content">

    <div class="tab-pane text" id="record-text">
      <?php echo $this->partial(
        'exhibits/underscore/partials/_text_tab.php'
      ); ?>
    </div>

    <div class="tab-pane spatial" id="record-spatial">
      <?php echo $this->partial(
        'exhibits/underscore/partials/_spatial_tab.php'
      ); ?>
    </div>

    <div class="tab-pane style" id="record-style">
      <?php echo $this->partial(
        'exhibits/underscore/partials/_style_tab.php'
      ); ?>
    </div>

    <?php echo $this->partial(
      'exhibits/underscore/partials/_record_plugin_panes.php'
    ); ?>

  </div>

  <!-- Save/Delete buttons. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/_form_actions.php'
  ); ?>

  <!-- SVG modal. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/_svg_modal.php'
  ); ?>

</script>

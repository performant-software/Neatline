<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form underscore template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<!-- Record edit form. -->
<script id="record-form-template" type="text/templates">

  <!-- Close button. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/_close_button.php'
  ); ?>

  <p class="lead" data-text="record.title | title"></p>

  <ul class="nav nav-pills">
    <li>
      <a href="#record-form-text" data-toggle="tab">Text</a></li>
    <li><a href="#record-form-spatial" data-toggle="tab">Spatial</a></li>
    <li><a href="#record-form-style" data-toggle="tab">Style</a></li>
  </ul>

  <div class="tab-content">

    <div class="tab-pane text" id="record-form-text">
      <?php echo $this->partial(
        'exhibits/underscore/partials/_text_tab.php'
      ); ?>
    </div>

    <div class="tab-pane spatial" id="record-form-spatial">
      <?php echo $this->partial(
        'exhibits/underscore/partials/_spatial_tab.php'
      ); ?>
    </div>

    <div class="tab-pane style" id="record-form-style">
      <?php echo $this->partial(
        'exhibits/underscore/partials/_style_tab.php'
      ); ?>
    </div>

  </div>

  <!-- Save/Delete buttons. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/_form_actions.php'
  ); ?>

  <!-- Delete modal. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/_delete_modal.php', array('warning' =>
      "This will delete the record from the database and remove all
      associated metadata. This action cannot be undone."
    )
  ); ?>

  <!-- SVG modal. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/_svg_modal.php'
  ); ?>

</script>

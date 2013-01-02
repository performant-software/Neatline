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
  <button type="button" class="close">&times;</button>

  <p class="lead" data-text="record.title"></p>

  <ul class="nav nav-pills">
    <li>
      <a href="#form-text" data-toggle="tab">
        <i class="icon-font"></i> Text
      </a>
    </li>
    <li>
      <a href="#form-spatial" data-toggle="tab">
        <i class="icon-map-marker"></i> Spatial
      </a>
    </li>
    <li>
      <a href="#form-style" data-toggle="tab">
        <i class="icon-tasks"></i> Style
      </a>
    </li>
  </ul>

  <div class="tab-content">

    <div class="tab-pane text" id="form-text">
      <?php echo $this->partial(
        'index/underscore/partials/_text_tab.php'
      ); ?>
    </div>

    <div class="tab-pane spatial" id="form-spatial">
      <?php echo $this->partial(
        'index/underscore/partials/_spatial_tab.php'
      ); ?>
    </div>

    <div class="tab-pane style" id="form-style">
      <?php echo $this->partial(
        'index/underscore/partials/_style_tab.php'
      ); ?>
    </div>

  </div>

  <?php echo $this->partial(
    'index/underscore/partials/_form_menu.php'
  ); ?>

</script>

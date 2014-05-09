<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="record-form-template" type="text/template">

  <!-- Close button. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/close_button.php'
  ); ?>

  <!-- Header. -->
  <p class="lead">
    <span class="id" rv-text="record:id | recordId"></span>
    <span class="title" rv-text="record:title | recordTitle"></span>
  </p>

  <!-- Tabs. -->
  <ul class="nav nav-pills">
    <li class="tab">
      <a href="#record-text" data-toggle="tab" data-slug="text">
        <span class="glyphicon glyphicon-font"></span> Text
      </a>
    </li>
    <li class="tab">
      <a href="#record-item" data-toggle="tab" data-slug="item">
        <span class="glyphicon glyphicon-link"></span> Item
      </a>
    </li>
    <li class="tab">
      <a href="#record-map" data-toggle="tab" data-slug="map">
        <span class="glyphicon glyphicon-globe"></span> Map
      </a>
    </li>
    <li class="tab">
      <a href="#record-style" data-toggle="tab" data-slug="style">
        <span class="glyphicon glyphicon-cog"></span> Style
      </a>
    </li>
  </ul>

  <!-- Panels. -->
  <div class="tab-content">
    <div class="tab-pane text" id="record-text">
      <?php echo $this->partial(
        'exhibits/underscore/partials/pane_text.php'
      ); ?>
    </div>
    <div class="tab-pane item" id="record-item">
      <?php echo $this->partial(
        'exhibits/underscore/partials/pane_item.php'
      ); ?>
    </div>
    <div class="tab-pane map" id="record-map">
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

</script>

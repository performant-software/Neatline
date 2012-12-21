<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Spatial tab template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<div class="control-group geometry">

  <legend>Geometry</legend>

  <label class="radio">
    <input type="radio" name="editMode" value="pan" checked>
    Navigate
  </label>

  <label class="radio">
    <input type="radio" name="editMode" value="point">
    Draw Point
  </label>

  <label class="radio">
    <input type="radio" name="editMode" value="line">
    Draw Line
  </label>

  <label class="radio">
    <input type="radio" name="editMode" value="poly">
    Draw Polygon
  </label>

  <label class="radio">
    <input type="radio" name="editMode" value="regPoly">
    Draw Regular Polygon
  </label>

  <div class="control-group indent regular-polygon">

    <div class="inline-inputs">
      <input type="text" name="sides" value="3" />
      Sides
    </div>

    <div class="inline-inputs">
      <input type="text" name="snap" value="5" />
      Snap Angle (degrees)
    </div>

    <label class="checkbox">
      <input type="checkbox" name="irregular">
      Irregular?
    </label>

  </div>

  <label class="radio">
    <input type="radio" name="editMode" value="modify">
    Modify Shape
  </label>

  <div class="control-group indent">

    <label class="checkbox">
      <input type="checkbox" name="modifyOptions" value="rotate">
      Rotate
    </label>

    <label class="checkbox">
      <input type="checkbox" name="modifyOptions" value="resize">
      Resize
    </label>

    <label class="checkbox">
      <input type="checkbox" name="modifyOptions" value="drag">
      Drag
    </label>

  </div>

  <label class="radio">
    <input type="radio" name="editMode" value="remove">
    Delete Shape
  </label>

  <hr>

  <div class="control-group">
    <div class="controls">
      <textarea name="coverage"
        placeholder="Spatial Data (Well-Known Text)"></textarea>
    </div>
  </div>

</div>

<div class="control-group">

  <legend>Visibility</legend>

  <?php echo $this->partial(
    'index/underscore/helpers/_text_input.php', array(
      'name' => 'min-zoom',
      'title' => 'Min Zoom'
  )); ?>

  <?php echo $this->partial(
    'index/underscore/helpers/_text_input.php', array(
      'name' => 'max-zoom',
      'title' => 'Max Zoom'
  )); ?>

</div>

<div class="control-group">

  <legend>Focus</legend>

  <?php echo $this->partial(
    'index/underscore/helpers/_text_input.php', array(
      'name' => 'map-focus',
      'title' => 'Coordinates'
  )); ?>

  <?php echo $this->partial(
    'index/underscore/helpers/_text_input.php', array(
      'name' => 'map-zoom',
      'title' => 'Zoom Level'
  )); ?>

  <div class="controls">
    <div class="inline-inputs">
      <button name="focus-map" class="btn btn-small">
        <i class="icon-map-marker"></i> Use Current Focus
      </button>
    </div>
  </div>


</div>

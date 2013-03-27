<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record spatial pane.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="control-group spatial">

  <label class="radio">
    <input type="radio" name="mode" value="pan" checked>
    Navigate
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="point">
    Draw Point
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="line">
    Draw Line
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="poly">
    Draw Polygon
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="regPoly">
    Draw Regular Polygon
  </label>

  <div class="control-group indent regular-polygon">

    <div class="inline-inputs">
      <input type="text" name="sides" value="3" />
      Sides
    </div>

    <div class="inline-inputs">
      <input type="text" name="snap" value="0" />
      Snap Angle (degrees)
    </div>

    <label class="checkbox">
      <input type="checkbox" name="irreg">
      Irregular?
    </label>

  </div>

  <label class="radio">
    <input type="radio" name="mode" value="svg">
    Draw SVG ( <a href="#svg-modal" data-toggle="modal">Paste</a> )
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="modify">
    Modify Shape
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="rotate">
    Rotate Shape
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="resize">
    Resize Shape
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="drag">
    Drag Shape
  </label>

  <label class="radio">
    <input type="radio" name="mode" value="remove">
    Delete Shape
  </label>

  <div class="control-group">
    <a name="clear" class="btn btn-primary btn-mini">
      <i class="icon-refresh icon-white"></i> Clear all Geometry
    </a>
  </div>

  <hr>

  <?php echo common('neatline/textarea', array(
      'name'  => 'coverage',
      'label' => 'Geometry',
      'bind'  => 'record.coverage',
      'class' => 'code'
  )); ?>

</div>

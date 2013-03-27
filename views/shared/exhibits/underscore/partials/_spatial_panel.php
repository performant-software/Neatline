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
    <input type="radio" name="mode" value="svg">
    Draw SVG ( <a href="#svg-modal" data-toggle="modal">Enter Markup</a> )
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
    <input type="radio" name="mode" value="modify">
    Modify Shape
  </label>

  <div class="control-group indent">

    <label class="checkbox">
      <input type="checkbox" name="modify" value="rotate">
      Rotate
    </label>

    <label class="checkbox">
      <input type="checkbox" name="modify" value="resize">
      Resize
    </label>

    <label class="checkbox">
      <input type="checkbox" name="modify" value="drag">
      Drag
    </label>

  </div>

  <label class="radio">
    <input type="radio" name="mode" value="remove">
    Delete Shape
  </label>

  <div class="control-group">
    <a name="clear" class="btn btn-primary btn-mini">
      <i class="icon-refresh icon-white"></i> Clear all Geometry
    </a>
  </div>

  <?php echo common('neatline/textarea', array(
      'name'  => 'coverage',
      'label' => 'Coverage (Well-Known Text)',
      'bind'  => 'record.coverage',
      'class' => 'code'
  )); ?>

  <!--
  <?php echo common('neatline/input', array(
      'name'  => 'wms_address',
      'label' => 'WMS Address',
      'bind'  => 'record.wms_address'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'wms_layers',
      'label' => 'WMS Layers',
      'bind'  => 'record.wms_layers'
  )); ?>
  -->

</div>

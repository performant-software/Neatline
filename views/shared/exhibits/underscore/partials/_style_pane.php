<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record style pane.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="control-group">

  <?php echo common('input', array(
      'name'  => 'tags',
      'label' => 'Tags',
      'bind'  => 'record.tags'
  )); ?>

  <?php echo common('select', array(
      'name'  => 'presenter',
      'label' => 'Presenter',
      'bind'  => 'record.presenter',
      'options' => _nl_getPresenters()
  )); ?>

  <?php echo common('input', array(
      'name'  => 'vector-color',
      'label' => 'Shape Color',
      'bind'  => 'record.vector_color',
      'class' => 'preview',
      'type'  => 'color'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'stroke-color',
      'label' => 'Line Color',
      'bind'  => 'record.stroke_color',
      'class' => 'preview',
      'type'  => 'color'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'select-color',
      'label' => 'Selected Color',
      'bind'  => 'record.select_color',
      'class' => 'preview',
      'type'  => 'color'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'vector-opacity',
      'label' => 'Shape Opacity',
      'bind'  => 'record.vector_opacity',
      'class' => 'preview opacity'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'stroke-opacity',
      'label' => 'Line Opacity',
      'bind'  => 'record.stroke_opacity',
      'class' => 'preview opacity'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'select-opacity',
      'label' => 'Selected Opacity',
      'bind'  => 'record.select_opacity',
      'class' => 'preview opacity'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'stroke-width',
      'label' => 'Line Width',
      'bind'  => 'record.stroke_width',
      'class' => 'preview integer'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'point-radius',
      'label' => 'Point Radius',
      'bind'  => 'record.point_radius',
      'class' => 'preview integer'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'point-image',
      'label' => 'Point Image',
      'bind'  => 'record.point_image',
      'class' => 'preview'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'min-zoom',
      'label' => 'Min Zoom',
      'bind'  => 'record.min_zoom',
      'useCurrent' => true
  )); ?>

  <?php echo common('input', array(
      'name'  => 'max-zoom',
      'label' => 'Max Zoom',
      'bind'  => 'record.max_zoom',
      'useCurrent' => true
  )); ?>

  <?php echo common('input', array(
      'name'  => 'map-focus',
      'label' => 'Default Focus',
      'bind'  => 'record.map_focus'
  )); ?>

  <?php echo common('input', array(
      'name'  => 'map-zoom',
      'label' => 'Default Zoom',
      'bind'  => 'record.map_zoom'
  )); ?>

  <div class="controls">
    <div class="inline-inputs">
      <a name="set-focus" class="btn btn-small">
        <i class="icon-map-marker"></i> Use Current Viewport as Default
      </a>
    </div>
  </div>

</div>

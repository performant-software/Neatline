<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div class="control-group">

  <legend>Groups</legend>

  <?php echo common('neatline/input', array(
      'name'  => 'tags',
      'label' => 'Tags',
      'bind'  => 'record.tags'
  )); ?>

  <?php if (count(nl_getRecordWidgets())): ?>
    <?php echo common('neatline/select', array(
        'name'  => 'widgets',
        'label' => 'Widgets',
        'bind'  => 'record.widgets | commaDelimited',
        'style' => 'widgets',
        'options' => nl_getRecordWidgets(),
        'multi' => true,
    )); ?>
  <?php endif; ?>

  <?php echo common('neatline/select', array(
      'name'  => 'presenter',
      'label' => 'Presenter',
      'bind'  => 'record.presenter',
      'style' => 'presenter',
      'options' => nl_getPresenters()
  )); ?>

  <legend>Colors</legend>

  <?php echo common('neatline/input', array(
      'name'  => 'fill-color',
      'label' => 'Fill Color',
      'bind'  => 'record.fill_color',
      'style' => 'fill-color',
      'class' => 'preview'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'select-color',
      'label' => 'Select Color',
      'bind'  => 'record.select_color',
      'style' => 'select-color',
      'class' => 'preview'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'stroke-color',
      'label' => 'Stroke Color',
      'bind'  => 'record.stroke_color',
      'style' => 'stroke-color',
      'class' => 'preview'
  )); ?>

  <legend>Opacities</legend>

  <?php echo common('neatline/input', array(
      'name'  => 'fill-opacity',
      'label' => 'Fill Opacity',
      'bind'  => 'record.fill_opacity',
      'style' => 'fill-opacity',
      'class' => 'preview opacity'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'select-opacity',
      'label' => 'Select Opacity',
      'bind'  => 'record.select_opacity',
      'style' => 'select-opacity',
      'class' => 'preview opacity'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'stroke-opacity',
      'label' => 'Stroke Opacity',
      'bind'  => 'record.stroke_opacity',
      'style' => 'stroke-opacity',
      'class' => 'preview opacity'
  )); ?>

  <legend>Dimensions</legend>

  <?php echo common('neatline/input', array(
      'name'  => 'stroke-width',
      'label' => 'Stroke Width',
      'bind'  => 'record.stroke_width',
      'style' => 'stroke-width',
      'class' => 'preview integer'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'point-radius',
      'label' => 'Point Radius',
      'bind'  => 'record.point_radius',
      'style' => 'point-radius',
      'class' => 'preview integer'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'weight',
      'label' => 'Order / Weight',
      'bind'  => 'record.weight',
      'style' => 'weight'
  )); ?>

  <legend>Dates</legend>

  <?php echo common('neatline/input', array(
      'name'  => 'start-date',
      'label' => 'Start Date',
      'bind'  => 'record.start_date',
      'style' => 'start-date'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'end-date',
      'label' => 'End Date',
      'bind'  => 'record.end_date',
      'style' => 'end-date'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'after-date',
      'label' => 'After Date',
      'bind'  => 'record.after_date',
      'style' => 'after-date'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'before-date',
      'label' => 'Before Date',
      'bind'  => 'record.before_date',
      'style' => 'before-date'
  )); ?>

  <legend>Imagery</legend>

  <?php echo common('neatline/input', array(
      'name'  => 'point-image',
      'label' => 'Point Image',
      'bind'  => 'record.point_image',
      'style' => 'point-image',
      'class' => 'preview'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'wms-address',
      'label' => 'WMS Address',
      'bind'  => 'record.wms_address',
      'style' => 'wms-address'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'wms-layers',
      'label' => 'WMS Layers',
      'bind'  => 'record.wms_layers',
      'style' => 'wms-layers'
  )); ?>

  <legend>Visibility</legend>

  <?php echo common('neatline/input', array(
      'name'  => 'min-zoom',
      'label' => 'Min Zoom',
      'bind'  => 'record.min_zoom',
      'style' => 'min-zoom',
      'useCurrent' => true
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'max-zoom',
      'label' => 'Max Zoom',
      'bind'  => 'record.max_zoom',
      'style' => 'max-zoom',
      'useCurrent' => true
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'map-focus',
      'label' => 'Default Focus',
      'bind'  => 'record.map_focus',
      'style' => 'map-focus'
  )); ?>

  <?php echo common('neatline/input', array(
      'name'  => 'map-zoom',
      'label' => 'Default Zoom',
      'bind'  => 'record.map_zoom',
      'style' => 'map-zoom'
  )); ?>

  <?php echo common('neatline/button', array(
      'name'  => 'set-focus',
      'icon'  => 'icon-map-marker',
      'text'  => 'Use Current Viewport as Default'
  )); ?>

</div>

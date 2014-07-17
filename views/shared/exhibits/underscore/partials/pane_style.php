<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<legend>Groups</legend>

<?php echo common('neatline/input', array(
    'name'  => 'tags',
    'modal' => 'tags',
    'label' => 'Tags',
    'bind'  => 'record:tags'
)); ?>

<?php if (count(nl_getRecordWidgets())): ?>

  <?php echo common('neatline/select', array(
      'name'    => 'widgets',
      'modal'   => 'widgets',
      'label'   => 'Widgets',
      'bind'    => 'record:widgets | commaDelimited',
      'options' => nl_getRecordWidgets(),
      'multi'   => true
  )); ?>

<?php endif; ?>

<?php echo common('neatline/select', array(
    'name'    => 'presenter',
    'modal'   => 'presenter',
    'label'   => 'Presenter',
    'bind'    => 'record:presenter',
    'options' => nl_getPresenters()
)); ?>

<legend>Colors</legend>

<?php echo common('neatline/input', array(
    'name'  => 'fill-color',
    'modal' => 'fill-color',
    'label' => 'Fill Color',
    'bind'  => 'record:fill_color',
    'class' => 'preview color'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'fill-color-select',
    'modal' => 'fill-color-select',
    'label' => 'Fill Color (Selected)',
    'bind'  => 'record:fill_color_select',
    'class' => 'preview color'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'stroke-color',
    'modal' => 'stroke-color',
    'label' => 'Stroke Color',
    'bind'  => 'record:stroke_color',
    'class' => 'preview color'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'stroke-color-select',
    'modal' => 'stroke-color-select',
    'label' => 'Stroke Color (Selected)',
    'bind'  => 'record:stroke_color_select',
    'class' => 'preview color'
)); ?>

<legend>Opacities</legend>

<?php echo common('neatline/input', array(
    'name'  => 'fill-opacity',
    'modal' => 'fill-opacity',
    'label' => 'Fill Opacity',
    'bind'  => 'record:fill_opacity',
    'class' => 'preview opacity'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'fill-opacity-select',
    'modal' => 'fill-opacity-select',
    'label' => 'Fill Opacity (Selected)',
    'bind'  => 'record:fill_opacity_select',
    'class' => 'preview opacity'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'stroke-opacity',
    'modal' => 'stroke-opacity',
    'label' => 'Stroke Opacity',
    'bind'  => 'record:stroke_opacity',
    'class' => 'preview opacity'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'stroke-opacity-select',
    'modal' => 'stroke-opacity-select',
    'label' => 'Stroke Opacity (Selected)',
    'bind'  => 'record:stroke_opacity_select',
    'class' => 'preview opacity'
)); ?>

<legend>Dimensions</legend>

<?php echo common('neatline/input', array(
    'name'  => 'stroke-width',
    'modal' => 'stroke-width',
    'label' => 'Stroke Width',
    'bind'  => 'record:stroke_width',
    'class' => 'preview integer'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'point-radius',
    'modal' => 'point-radius',
    'label' => 'Point Radius',
    'bind'  => 'record:point_radius',
    'class' => 'preview integer'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'zindex',
    'modal' => 'zindex',
    'label' => 'Z-Index',
    'bind'  => 'record:zindex'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'weight',
    'modal' => 'weight',
    'label' => 'Order / Weight',
    'bind'  => 'record:weight'
)); ?>

<legend>Dates</legend>

<?php echo common('neatline/input', array(
    'name'  => 'start-date',
    'modal' => 'start-date',
    'label' => 'Start Date',
    'bind'  => 'record:start_date'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'end-date',
    'modal' => 'end-date',
    'label' => 'End Date',
    'bind'  => 'record:end_date'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'after-date',
    'modal' => 'after-date',
    'label' => 'After Date',
    'bind'  => 'record:after_date'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'before-date',
    'modal' => 'before-date',
    'label' => 'Before Date',
    'bind'  => 'record:before_date'
)); ?>

<legend>Imagery</legend>

<?php echo common('neatline/input', array(
    'name'  => 'point-image',
    'modal' => 'point-image',
    'label' => 'Point Image',
    'bind'  => 'record:point_image',
    'class' => 'preview'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'wms-address',
    'modal' => 'wms-address',
    'label' => 'WMS Address',
    'bind'  => 'record:wms_address'
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'wms-layers',
    'modal' => 'wms-layers',
    'label' => 'WMS Layers',
    'bind'  => 'record:wms_layers'
)); ?>

<legend>Visibility</legend>

<?php echo common('neatline/input', array(
    'name'  => 'min-zoom',
    'modal' => 'min-zoom',
    'label' => 'Min Zoom',
    'bind'  => 'record:min_zoom',
    'useCurrent' => true
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'max-zoom',
    'modal' => 'max-zoom',
    'label' => 'Max Zoom',
    'bind'  => 'record:max_zoom',
    'useCurrent' => true
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'map-focus',
    'modal' => 'map-focus',
    'label' => 'Default Focus',
    'bind'  => 'record:map_focus',
    'useCurrent' => true
)); ?>

<?php echo common('neatline/input', array(
    'name'  => 'map-zoom',
    'modal' => 'map-zoom',
    'label' => 'Default Zoom',
    'bind'  => 'record:map_zoom',
    'useCurrent' => true
)); ?>

<?php echo common('neatline/button', array(
    'name'  => 'set-focus',
    'modal' => 'set-focus',
    'text'  => 'Use Current Viewport as Default'
)); ?>

<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Style tab template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'vector-color',
    'title' => 'Shape Color',
    'bind'  => 'record.vector_color'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'stroke-color',
    'title' => 'Line Color',
    'bind'  => 'record.stroke_color'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'select-color',
    'title' => 'Selected Color',
    'bind'  => 'record.select_color'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'vector-opacity',
    'title' => 'Shape Opacity',
    'bind'  => 'record.vector_opacity'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'select-opacity',
    'title' => 'Selected Opacity',
    'bind'  => 'record.select_opacity'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'stroke-opacity',
    'title' => 'Line Opacity',
    'bind'  => 'record.stroke_opacity'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'image-opacity',
    'title' => 'Image Opacity',
    'bind'  => 'record.image_opacity'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'stroke-width',
    'title' => 'Line Width',
    'bind'  => 'record.stroke_width'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'point-radius',
    'title' => 'Point Radius',
    'bind'  => 'record.point_radius'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'point-image',
    'title' => 'Point Image',
    'bind'  => 'record.point_image'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'min-zoom',
    'title' => 'Min Zoom',
    'bind'  => 'record.min_zoom'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'max-zoom',
    'title' => 'Max Zoom',
    'bind'  => 'record.max_zoom'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'map-focus',
    'title' => 'Focus Coordinates',
    'bind'  => 'record.map_focus'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name'  => 'map-zoom',
    'title' => 'Focus Zoom',
    'bind'  => 'record.map_zoom'
)); ?>

<div class="controls">
  <div class="inline-inputs">
    <button name="focus-map" class="btn btn-small">
      <i class="icon-map-marker"></i> Use Current Focus
    </button>
  </div>
</div>

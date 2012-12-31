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
    'name' => 'vector-color',
    'title' => 'Shape Color'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'stroke-color',
    'title' => 'Line Color'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'select-color',
    'title' => 'Selected Color'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'vector-opacity',
    'title' => 'Shape Opacity'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'select-color',
    'title' => 'Selected Opacity'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'stroke-opacity',
    'title' => 'Line Opacity'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'image-opacity',
    'title' => 'Image Opacity'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'stroke-width',
    'title' => 'Line Width'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'point-radius',
    'title' => 'Point Radius'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'point-image',
    'title' => 'Point Image'
)); ?>

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

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'map-focus',
    'title' => 'Focus Coordinates'
)); ?>

<?php echo $this->partial(
  'index/underscore/helpers/_text_input.php', array(
    'name' => 'map-zoom',
    'title' => 'Focus Zoom'
)); ?>

<div class="controls">
  <div class="inline-inputs">
    <button name="focus-map" class="btn btn-small">
      <i class="icon-map-marker"></i> Use Current Focus
    </button>
  </div>
</div>

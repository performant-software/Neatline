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
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'tags',
    'label' => 'Tags',
    'bind'  => 'record.tags'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'vector-color',
    'label' => 'Shape Color',
    'bind'  => 'record.vector_color',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'stroke-color',
    'label' => 'Line Color',
    'bind'  => 'record.stroke_color',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'select-color',
    'label' => 'Selected Color',
    'bind'  => 'record.select_color',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'vector-opacity',
    'label' => 'Shape Opacity',
    'bind'  => 'record.vector_opacity',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'stroke-opacity',
    'label' => 'Line Opacity',
    'bind'  => 'record.stroke_opacity',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'select-opacity',
    'label' => 'Selected Opacity',
    'bind'  => 'record.select_opacity',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'image-opacity',
    'label' => 'Image Opacity',
    'bind'  => 'record.image_opacity',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'stroke-width',
    'label' => 'Line Width',
    'bind'  => 'record.stroke_width',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'point-radius',
    'label' => 'Point Radius',
    'bind'  => 'record.point_radius',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'point-image',
    'label' => 'Point Image',
    'bind'  => 'record.point_image',
    'class' => 'preview'
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'min-zoom',
    'label' => 'Min Zoom',
    'bind'  => 'record.min_zoom',
    'useCurrent' => true
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'max-zoom',
    'label' => 'Max Zoom',
    'bind'  => 'record.max_zoom',
    'useCurrent' => true
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'map-focus',
    'label' => 'Default Focus',
    'bind'  => 'record.map_focus',
    'useCurrent' => true
)); ?>

<?php echo $this->partial(
  'exhibits/underscore/helpers/_text_input.php', array(
    'name'  => 'map-zoom',
    'label' => 'Default Zoom',
    'bind'  => 'record.map_zoom',
    'useCurrent' => true
)); ?>

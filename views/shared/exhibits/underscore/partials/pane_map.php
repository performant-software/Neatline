<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<legend>Drawing Tools</legend>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="pan" checked>
    <?php echo __('Navigate'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'navigate', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="point">
    <?php echo __('Draw Point'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'draw-point', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="line">
    <?php echo __('Draw Line'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'draw-line', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="poly">
    <?php echo __('Draw Polygon'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'draw-polygon', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="regPoly">
    <?php echo __('Draw Regular Polygon'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'draw-regular-polygon', 'text' => '?'
  )); ?>

</div>


<div class="regular-polygon">

  <div class="form-group">

    <input type="text" class="form-control" name="sides" value="3" />
    <label><?php echo __('Sides'); ?></label>

    <?php echo common('neatline/help', array(
      'modal' => 'sides', 'text' => '?'
    )); ?>

  </div>

  <div class="form-group">

    <input type="text" class="form-control" name="snap" value="15" />
    <label><?php echo __('Snap Angle'); ?></label>

    <?php echo common('neatline/help', array(
      'modal' => 'snap-angle', 'text' => '?'
    )); ?>

  </div>

  <div class="checkbox">

    <label>
      <input type="checkbox" name="irreg">
      <label><?php echo __('Irregular?'); ?></label>
    </label>

    <?php echo common('neatline/help', array(
      'modal' => 'irregular', 'text' => '?'
    )); ?>

  </div>

</div>


<div class="radio">

  <label>

    <input type="radio" name="mode" value="svg">
    <?php echo __('Draw SVG'); ?>
    ( <a href="#svg-modal" data-toggle="modal" class="label-link">
      <?php echo __('Enter Markup'); ?>
    </a> )

  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'draw-svg', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="modify">
    <?php echo __('Modify Shape'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'modify-shape', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="rotate">
    <?php echo __('Rotate Shape'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'rotate-shape', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="resize">
    <?php echo __('Resize Shape'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'resize-shape', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="drag">
    <?php echo __('Drag Shape'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'drag-shape', 'text' => '?'
  )); ?>

</div>


<div class="radio">

  <label>
    <input type="radio" name="mode" value="remove">
    <?php echo __('Delete Shape'); ?>
  </label>

  <?php echo common('neatline/help', array(
    'modal' => 'delete-shape', 'text' => '?'
  )); ?>

</div>


<a name="clear" class="btn btn-primary btn-xs">
  <?php echo __('Clear all Geometry'); ?>
</a>

<?php echo common('neatline/help', array(
  'modal' => 'clear-all-geometry', 'text' => '?'
)); ?>


<legend>Spatial Data</legend>


<?php echo common('neatline/textarea', array(
    'name'  => 'coverage',
    'modal' => 'coverage',
    'label' => 'Geometry (Well-Known Text)',
    'bind'  => 'record:coverage',
    'class' => 'code'
)); ?>

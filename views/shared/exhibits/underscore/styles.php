<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="exhibit-styles-template" type="text/template">

  <div class="control-group">

    <label><?php echo __('Stylesheet'); ?></label>
    <div class="controls">
      <div class="inline-inputs">
        <div id="styles"></div>
      </div>
    </div>

    <?php echo common('neatline/input', array(
        'name'  => 'map-focus',
        'label' => 'Default Map Focus',
        'bind'  => 'exhibit.map_focus'
    )); ?>

    <?php echo common('neatline/input', array(
        'name'  => 'map-zoom',
        'label' => 'Default Map Zoom',
        'bind'  => 'exhibit.map_zoom'
    )); ?>

    <?php echo common('neatline/button', array(
        'name'  => 'set-focus',
        'icon'  => 'icon-map-marker',
        'text'  => 'Use Current Viewport as Default'
    )); ?>

  </div>

  <?php echo common('neatline/save'); ?>

</script>

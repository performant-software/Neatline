<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit styles form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="exhibit-styles-template" type="text/templates">

  <div class="control-group">

    <?php echo $this->partial(
      'exhibits/underscore/helpers/_textarea.php', array(
        'id'    => 'styles',
        'name'  => 'styles',
        'label' => 'Stylesheet',
        'bind'  => 'exhibit.styles'
    )); ?>

    <?php echo $this->partial(
      'exhibits/underscore/helpers/_text_input.php', array(
        'name'  => 'map-focus',
        'label' => 'Default Map Focus',
        'bind'  => 'exhibit.map_focus'
    )); ?>

    <?php echo $this->partial(
      'exhibits/underscore/helpers/_text_input.php', array(
        'name'  => 'map-zoom',
        'label' => 'Default Map Zoom',
        'bind'  => 'exhibit.map_zoom'
    )); ?>

    <div class="controls">
      <div class="inline-inputs">
        <a name="set-focus" class="btn btn-small">
          <i class="icon-map-marker"></i> Use Current Viewport as Default
        </a>
      </div>
    </div>

  </div>

  <div class="actions">
    <a name="save" class="btn btn-large btn-primary" \>
      <i class="icon-ok icon-white"></i> <?php echo __('Save'); ?>
    </a>
  </div>

</script>

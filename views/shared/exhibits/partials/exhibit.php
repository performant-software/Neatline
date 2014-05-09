<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div id="neatline" class="<?php echo nl_getExhibitWidgetClasses(); ?>">
  <div id="neatline-map" class="neatline-block"></div>
</div>

<!-- Globals constants. -->
<script type="text/javascript">
  Neatline.g = <?php echo Zend_Json::encode(
    nl_getGlobals(nl_getExhibit())
  ); ?>
</script>

<!-- Underscore templates. -->
<?php echo $this->partial('exhibits/underscore/bubble.php'); ?>

<!-- Plugin templates. -->
<?php fire_plugin_hook('neatline_public_templates', array(
  'exhibit' => nl_getExhibit()
)); ?>

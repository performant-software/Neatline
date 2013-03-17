<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Top-level Neatline partial.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div id="neatline">
  <?php echo $this->partial('neatline/_map.php'); ?>
</div>

<!-- JSON globals. -->
<script type="text/javascript">
  Neatline.global = <?php echo Zend_Json::encode(
    _nl_getGlobals(_nl_exhibit())
  ); ?>
</script>

<!-- Underscore templates. -->
<?php echo $this->partial('neatline/underscore/_static_bubble.php'); ?>

<!-- Plugin templates. ->
<?php fire_plugin_hook('neatline_public_underscore', array(
  'exhibit' => _nl_exhibit()
)); ?>

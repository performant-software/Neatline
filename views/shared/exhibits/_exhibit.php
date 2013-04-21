<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

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
  <div id="neatline-map" class="neatline-block"></div>
</div>

<!-- Application templates. -->
<?php echo $this->partial('exhibits/underscore/bubble.php'); ?>

<!-- Plugin templates. -->
<?php fire_plugin_hook('neatline_public_templates', array(
  'exhibit' => _nl_exhibit()
)); ?>

<!-- Global constants. -->
<script type="text/javascript">
  _.extend(Neatline, {

    globals: <?php echo Zend_Json::encode(
      _nl_getGlobals(_nl_exhibit())
    ); ?>,

    strings: <?php echo Zend_Json::encode(
      _nl_getStrings(_nl_exhibit())
    ); ?>

  });
</script>

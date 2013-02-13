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
    _nl_getGlobals($exhibit)
  ); ?>
</script>

<!-- Underscore templates. -->
<?php echo $this->partial('neatline/underscore/_small_bubble.php'); ?>

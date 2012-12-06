<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

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
  <!-- Map. -->
  <?php echo $this->partial('neatline/_map.php'); ?>
</div>

<!-- JSON globals. -->
<script type="text/javascript">
  __exhibit = <?php echo neatline_renderExhibit($exhibit); ?>
</script>

<!-- Bubble. -->
<?php echo $this->partial('neatline/_bubble.php'); ?>

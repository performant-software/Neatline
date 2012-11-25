<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Editor container partial.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!-- Records. -->
<?php echo $this->partial('index/_records.php', array(
  'exhibit' => $exhibit
)); ?>

<!-- Exhibit. -->
<?php echo $this->partial('neatline/_neatline.php', array(
  'exhibit' => $exhibit
)); ?>

<!-- JSON globals. -->
<script type="text/javascript">
  __editor = <?php echo neatline_renderEditor($exhibit); ?>
</script>

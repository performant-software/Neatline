<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * The top-level Neatline editor view. Wraps the markup for the editing
 * interface and then calls the central _neatline.php partial, which is
 * shared with public views.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!-- Header. -->
<?php echo $this->partial('index/_editor_header.php', array(
  'exhibit' => $exhibit,
  'title' => __('Neatline Editor: %s', $exhibit->title)
)); ?>

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
  __editor = <?php echo neatline_editorGlobals($exhibit); ?>
</script>

<?php echo $this->partial('index/_editor_footer.php'); ?>

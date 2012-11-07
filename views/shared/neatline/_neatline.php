<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Top-level Neatline partial.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */
?>

<!-- Neatline container. -->
<div id="neatline">

    <!-- Map. -->
    <div id="neatline-map" class="neatline-block"></div>

</div>

<!-- JSON globals. -->
<script type="text/javascript">
    <?php $renderer = new NeatlineRenderer($exhibit); ?>
    Neatline = <?php echo json_encode($renderer->render()); ?>
</script>

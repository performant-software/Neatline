<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Content management shell in editor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php
$title = __('Neatline | Browse Exhibits');
echo head(array('content_class' => 'neatline', 'title' => $title));
?>

<div id="primary">

  <?php echo flash(); ?>
  <h1><?php echo $title; ?></h1>

  <?php if(has_neatlines_for_loop()): ?>
  <div class="pagination"><?php echo pagination_links(); ?></div>

    <?php foreach (loop('NeatlineExhibit') as $exhibit): ?>
    <div id="neatline-<?php echo neatline('id'); ?>">
        <h2 class="title"><?php echo link_to_neatline(); ?></h2>
        <?php echo neatline('description'); ?>
    </div>
    <?php endforeach; ?>

  <!-- Pagination. -->
  <div class="pagination"><?php echo pagination_links(); ?></div>
  <?php endif; ?>

</div>

<?php echo foot(); ?>

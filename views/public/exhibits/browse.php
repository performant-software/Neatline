<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php
  echo head(array(
    'title' => __('Neatline | Browse Exhibits'),
    'content_class' => 'neatline'
  ));
?>

<div id="primary">

  <?php echo flash(); ?>
  <h1><?php echo __('Neatline | Browse Exhibits'); ?></h1>

  <?php if (nl_areExhibits()): ?>

    <div class="pagination"><?php echo pagination_links(); ?></div>

      <?php foreach (loop('NeatlineExhibit') as $e): ?>
        <h2>
          <?php echo nl_link($e, 'show', nl_field('title'),
            array('class' => 'neatline'), true);
          ?>
        </h2>
      <?php endforeach; ?>

    <div class="pagination"><?php echo pagination_links(); ?></div>

  <?php endif; ?>

</div>

<?php echo foot(); ?>

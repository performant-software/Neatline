<?php
$title = 'Browse Neatline Exhibits';
head(array('content_class' => 'neatline', 'title' => $title));
?>
<div id="primary">
<?php echo flash(); ?>
<h1><?php echo $title; ?></h1>

<?php if(has_neatlines_for_loop()): while (loop_neatlines()): ?>
<div id="neatline-<?php echo neatline('id'); ?>">
    <h2 class="title"><?php echo link_to_neatline(); ?></h2>
    <?php echo neatline('description'); ?>
</div>
<?php endwhile; ?>

<!-- Pagination. -->
<div class="pagination"><?php echo pagination_links(); ?></div>
<?php endif; ?>
</div>

<?php foot(); ?>

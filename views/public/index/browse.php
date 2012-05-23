<?php
$title = 'Browse Neatline Exhibits';
head(array('content_class' => 'neatline', 'title' => $title));
?>
<div id="primary">
<?php echo flash(); ?>
<h1><?php echo $title; ?></h1>

<?php if($neatlines): foreach ($neatlines as $neatline): ?>
<div id="neatline-<?php echo $neatline->id; ?>">
    <h2 class="title">
        <a href="<?php echo public_uri('neatline-exhibits/show/fullscreen/' . $neatline->slug); ?>">
            <?php echo $neatline->name; ?>
        </a>
    </h2>
    <?php $description = $neatline->description; echo nls2p(snippet_by_word_count($description, 20)); ?>
</div>
<?php endforeach; ?>

<!-- Pagination. -->
<?php if ($pagination['total_results'] > $pagination['per_page']): ?>
<div class="pagination">
    <?php echo pagination_links(array('scrolling_style' => 'All',
    'page_range' => '5',
    'page' => $pagination['current_page'],
    'per_page' => $pagination['per_page'],
    'total_results' => $pagination['total_results'])); ?>
</div>
<?php endif; ?>
<?php endif; ?>
</div>

<?php foot(); ?>

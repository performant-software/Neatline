<?php
$title = 'Browse Neatline Exhibits';
head(array('content_class' => 'neatline', 'title' => $title));
?>
<div id="primary">
<?php echo flash(); ?>
<h1><?php echo $title; ?></h1>

<?php if($neatlineexhibits): foreach ($neatlineexhibits as $neatline): ?>
<div id="neatline-<?php echo $neatline->id; ?>">
    <h2 class="title">
        <a href="<?php echo public_uri('neatline-exhibits/show/' . $neatline->slug); ?>">
            <?php echo $neatline->name; ?>
        </a>
    </h2>
    <?php $description = $neatline->description; echo nls2p(snippet_by_word_count($description, 20)); ?>
</div>
<?php endforeach; ?>

<!-- Pagination. -->
<div class="pagination"><?php echo pagination_links(); ?></div>
<?php endif; ?>
</div>

<?php foot(); ?>

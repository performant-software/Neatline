<?php
    neatline_queueNeatlineAssets(get_current_neatline());
    neatline_queuePublicAssets();
?>

<?php
$title = neatline('name');
head(array('title' => $title, 'bodyclass' => 'neatline neatline-'.neatline('id'))); ?>

<!-- The core Neatline partial. -->
<?php echo $this->partial('neatline/_neatline.php', array(
    'exhibit' => get_current_neatline()
)); ?>

<div class="exhibit-description"><?php echo neatline('description'); ?></div>

<?php foot(); ?>


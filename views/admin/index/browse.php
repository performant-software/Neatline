<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Browse exhibits.
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

<p class="add-button">
    <a class="add green button" href="<?php echo html_escape(url('neatline/add')); ?>">
        <?php echo __('Create an Exhibit'); ?>
    </a>
</p>

<div id="primary">

<?php echo flash(); ?>

<?php if(has_neatlines_for_loop()): ?>
<div class="pagination"><?php echo pagination_links(); ?></div>

<table class="neatline">

    <thead>
        <tr>

        <!-- Column headings. -->
        <?php echo browse_sort_links(array(
            __('Exhibit') => 'title',
            __('Items Query') => null,
            __('Modified') => 'modified',
            __('# Items') => 'added',
            __('Public') => 'public',
            __('Edit') => null
        ), array(
            'link_tag' => 'th scope="col"',
            'list_tag' => ''
        )); ?>

        </tr>
    </thead>

    <tbody>

        <!-- Exhibit listings. -->
        <?php foreach(loop('NeatlineExhibit') as $exhibit): ?>
        <tr id="neatline-<?php echo neatline('id'); ?>">
            <td class="title">
                <?php echo link_to_neatline(); ?>
                <ul class="action-links group">
                    <li><?php echo link_to_neatline(__('Edit Details'), array('class' => 'edit'), 'edit', null, false); ?></li>
                    <li><?php echo link_to_neatline(__('Delete'), array('class' => 'delete delete-confirm'), 'delete-confirm', null, false); ?></li>
            </td>
            <td><?php echo link_to_neatline(__('Edit Query'), array('class' => 'query'), 'query', null, false);?></td>
            <td><?php echo format_date(neatline('modified')); ?></td>
            <td><?php echo total_records_for_neatline(); ?></td>
            <td><?php echo neatline('public') ? __('Yes') : __('No'); ?></td>
            <td><a href="<?php echo url('neatline/editor/' . neatline('id')); ?>" class="edit"><?php echo __('Edit'); ?></a></td>
        </tr>
        <?php endforeach; ?>

    </tbody>

</table>

<!-- Pagination. -->
<div class="pagination"><?php echo pagination_links(); ?></div>

<?php else: ?>

    <p class="neatline-alert">
        <?php echo __('There are no Neatline exhibits yet.'); ?>
        <a href="<?php echo url('neatline/add'); ?>"><?php echo __('Create one!'); ?></a>
    </p>

<?php endif; ?>

</div>

<?php echo foot(); ?>

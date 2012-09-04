<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Main portal view for Neatline.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<?php
$title = __('Neatline | Browse Exhibits');
head(array('content_class' => 'neatline', 'title' => $title));
?>

<p class="add-button">
    <a class="add green button" href="<?php echo html_escape(uri('neatline-exhibits/add')); ?>">
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
        <?php browse_headings(array(
            __('Exhibit') => 'name',
            __('Items Query') => null,
            __('Modified') => 'modified',
            __('# Items') => 'added',
            __('Public') => 'public',
            __('Edit') => null
        )); ?>
        </tr>
    </thead>

    <tbody>
        <!-- Exhibit listings. -->
        <?php while (loop_neatlines()): ?>
        <tr id="neatline-<?php echo neatline('id'); ?>">
            <td class="title">
                <?php echo link_to_neatline(); ?>
                <div class="slug-preview">/<?php echo neatline('slug'); ?></div>
                <?php
                    echo link_to_neatline(__('Edit Details'), array('class' => 'edit'), 'edit', null, false);
                    echo link_to_neatline(__('Delete'), array('class' => 'delete delete-confirm'), 'delete-confirm', null, false);
                ?>
            </td>
            <td><?php echo link_to_neatline(__('Edit Query'), array('class' => 'query'), 'query', null, false);?></td>
            <td><?php echo format_date(neatline('modified')); ?></td>
            <td><?php echo total_records_for_neatline(); ?></td>
            <td><?php echo neatline('public') ? __('Yes') : __('No'); ?></td>
            <td><a href="<?php echo uri('neatline-exhibits/editor/' . neatline('id')); ?>" class="edit"><?php echo __('Edit'); ?></a></td>
        </tr>
        <?php endwhile; ?>
    </tbody>

</table>

<div class="pagination"><?php echo pagination_links(); ?></div>

<?php else: ?>

    <p class="neatline-alert">
        <?php echo __('There are no Neatline exhibits yet.'); ?>
        <a href="<?php echo uri('neatline-exhibits/add'); ?>"><?php echo __('Create one!'); ?></a>
    </p>

<?php endif; ?>

</div>

<?php foot(); ?>

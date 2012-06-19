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
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<?php
$title = 'Neatline | Browse Exhibits';
head(array('content_class' => 'neatline', 'title' => $title));
?>

<h1><?php echo $title; ?></h1>
<?php if (has_permission('Neatline_Index', 'add')): ?>
<p class="add-button">
    <a class="add" href="<?php echo html_escape(uri('neatline-exhibits/add')); ?>">
        Create an Exhibit
    </a>
</p>
<?php endif; ?>

<div id="primary">

<?php echo flash(); ?>

<?php if(has_neatlines_for_loop()): ?>
<div class="pagination"><?php echo pagination_links(); ?></div>

<table class="neatline">

    <thead>
        <tr>
        <!-- Column headings. -->
        <?php browse_headings(array(
            'Exhibit' => 'name',
            'Items Query' => null,
            'Modified' => 'modified',
            '# Items' => 'added',
            'Public' => 'public',
            'Edit' => null
        )); ?>
        </tr>
    </thead>

    <tbody>
        <!-- Exhibit listings. -->
        <?php while (loop_neatlines()): ?>
        <tr id="neatline-<?php echo neatline('id'); ?>">
            <td class="title">
                <?php
                if (has_permission('Neatline_Index', 'show')) {
                  echo link_to_neatline();
                } else {
                  echo neatline('name');
                }
                ?>
                <div class="slug-preview">/<?php echo neatline('slug'); ?></div>

                <?php
                if (has_permission('Neatline_Index', 'edit')) {
                    echo link_to_neatline('Edit Details', array('class' => 'edit'), 'edit');
                }

                if (has_permission('Neatline_Index', 'delete')) {
                    echo link_to_neatline('delete', array('class' => 'delete delete-confirm'), 'delete-confirm');
                }
                ?>
            </td>
            <td>
              <?php
              if (has_permission('Neatline_Index', 'query')) {
                  echo link_to_neatline('Edit Query', array('class' => 'query'), 'query');
              }
              ?>
            </td>
            <td><?php echo format_date(neatline('modified')); ?></td>
            <td><?php echo total_records_for_neatline(); ?></td>
            <td><?php echo neatline('public') ? 'yes' : 'no'; ?></td>
            <td>
            <?php if (has_permission('Neatline_Index', 'edit')): ?>
            <?php echo button_to(uri('neatline-exhibits/editor/' . neatline('id')), null, 'Edit', array()); ?>
            <?php endif; ?>
            </td>
        </tr>
        <?php endwhile; ?>
    </tbody>

</table>

<div class="pagination"><?php echo pagination_links(); ?></div>

<?php else: ?>

    <p class="neatline-alert">There are no Neatline exhibits yet.
    <?php if (has_permission('Neatline_Index', 'add')): ?>
    <a href="<?php echo uri('neatline-exhibits/add'); ?>">Create one!</a>
    <?php endif; ?>
    </p>

<?php endif; ?>

</div>

<?php
foot();
?>

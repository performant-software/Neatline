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

<p class="add-button">
    <a class="add" href="<?php echo html_escape(uri('neatline-exhibits/add')); ?>">
        Create an Exhibit
    </a>
</p>

<div id="primary">

<?php echo flash(); ?>

<?php if(count($neatlineexhibits) > 0): ?>
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
        <?php foreach ($neatlineexhibits as $neatline): ?>
        <tr id="<?php echo $neatline->id; ?>">
            <td class="title"><?php echo neatline_linkToNeatline($neatline); ?>
                <div class="slug-preview">/<?php echo $neatline->slug; ?></div>
                <a href="<?php echo uri('neatline-exhibits/edit/' . $neatline->id); ?>" class="edit">Edit Details</a>
                <a href="<?php echo uri('neatline-exhibits/delete-confirm/' . $neatline->id); ?>" class="delete delete-confirm">Delete</a>
            </td>
            <td><a href="<?php echo uri('neatline-exhibits/query/' . $neatline->id); ?>">Edit Query</a></td>
            <td><?php echo neatline_formatDate($neatline->modified); ?></td>
            <td><?php echo $neatline->getNumberOfRecords(); ?></td>
            <td><?php echo $neatline->public ? 'yes' : 'no'; ?></td>
            <td><?php echo button_to(uri('neatline-exhibits/editor/' . $neatline->id), null, 'Edit', array()); ?></td>
        </tr>
        <?php endforeach; ?>
    </tbody>

</table>

<div class="pagination"><?php echo pagination_links(); ?></div>

<?php else: ?>

    <p class="neatline-alert">There are no Neatline exhibits yet.
    <a href="<?php echo uri('neatline-exhibits/add'); ?>">Create one!</a></p>

<?php endif; ?>

</div>

<?php
foot();
?>

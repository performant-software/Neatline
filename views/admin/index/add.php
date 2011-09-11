<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Create a new neatline.
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
head(array('content_class' => 'neatline'));
?>

<?php echo $this->partial('index/_header.php', array(
    'tab' => 'neatlines',
    'add_button_uri' => 'neatline-exhibits/add',
    'add_button_text' => 'Create a Neatline'
)); ?>

<div id="primary">

<form method="post" id="create-neatline">

    <div id="title-text">
        <h1 id="neatline-add-header">Create a Neatline Exhibit</h1>
        <h3 id="neatline-add-subheader">Step 1: Select a map and a timeline, customize the layout</h3>
    </div>

    <h2 class="neatline-label">Enter a Title:</h2>
    <?php echo neatline_titleInput(); ?>

    <hr>

    <h2 class="neatline-label">Choose a Map:</h2>
    <?php echo neatline_mapSelect(); ?>

    <hr>

    <h2 class="neatline-label">Choose a Timeline:</h2>
    <?php echo neatline_timelineSelect(); ?>

    <hr>

    <h2 class="neatline-label">Configure Layout:</h2>
    <?php echo $this->partial('index/_layout_builder.php'); ?>

    <?php echo neatline_hiddenElement('top_element', 'map'); ?>
    <?php echo neatline_hiddenElement('undated_items_position', 'right'); ?>
    <?php echo neatline_hiddenElement('undated_items_height', 'partial'); ?>

    <?php echo neatline_buttonTo('', 'save_neatline',
        'Create Neatline', array('class' => 'neatline btn primary'), 'save-neatline', false); ?>

</form>

</div>

<?php
foot();
?>

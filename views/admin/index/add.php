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
    'subtitle' => 'Create Exhibit',
    'add_button_uri' => 'neatline-exhibits/add',
    'add_button_text' => 'Create an Exhibit'
)); ?>

<div id="primary">

<?php echo $form; ?>

<!--
<form method="post" id="create-neatline">

    <h2 class="neatline-label">Enter a title:</h2>
    <?php echo neatline_titleInput($neatline->name); ?>
    <?php if (array_key_exists('title', $errors)) { echo neatline_error($errors['title']); } ?>

    <hr>

    <?php if (plugin_is_active('NeatlineMaps')): ?>

        <div class="neatline-select-container">
            <h2 class="neatline-label">Choose a map:</h2>
            <?php echo neatline_mapSelect($neatline->map_id); ?>
        </div>

        <div class="neatline-select-container">
            <h2 class="neatline-label">Or, choose an image:</h2>
            <?php echo neatline_imageSelect($neatline->image_id); ?>
        </div>
        <?php if (array_key_exists('map', $errors)) { echo neatline_error($errors['map']); } ?>

    <?php else: ?>

        <div class="neatline-select-container">
            <h2 class="neatline-label">Choose an image:</h2>
            <?php echo neatline_imageSelect($neatline->image_id); ?>
        </div>
        <?php if (array_key_exists('map', $errors)) { echo neatline_error($errors['map']); } ?>

    <?php endif; ?>

    <h3>Leave blank to use an OpenStreetMap base layer.</h3>

    <hr>

    <?php echo neatline_buttonTo('', 'save_neatline',
        'Create Exhibit', array('class' => 'neatline btn primary'), 'create-neatline', array(), false, 'create-fieldset'); ?>

</form>
-->

</div>

<?php
foot();
?>

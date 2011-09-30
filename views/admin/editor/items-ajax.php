<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Items browse markup.
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

<table id="items">

    <?php foreach ($items as $item): ?>

        <tr class="item-row">
            <td class="item-title">
                <span class="item-title-text"><?php echo item('Dublin Core', 'Title', null, $item); ?></span>
                <span class="item-title-fader"></span>
            </td>
            <td class="col-1 col-row space">
                <input type="checkbox" <?php echo neatline_getRecordStatusForCheckBox($neatline, $item, 'space'); ?> />
            </td>
            <td class="col-2 col-row time">
                <input type="checkbox" <?php echo neatline_getRecordStatusForCheckBox($neatline, $item, 'time'); ?> />
            </td>
        </tr>

        <tr class="edit-form">
            <td colspan="3">
                <?php echo $this->partial('editor/_edit_neatline_record.php', array(
                    'item' => $item,
                    'neatline' => $neatline
                )); ?>
            </td>
        </tr>

    <?php endforeach; ?>

</table>

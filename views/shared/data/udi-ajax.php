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

<table>

    <?php foreach ($items as $item): ?>

        <tr class="item-row" recordid="<?php echo $item->id; ?>">
            <td class="item-title">
                <span class="item-title-text"><?php echo item('Dublin Core', 'Title', null, $item); ?></span>
            </td>
            <td class="col-1 col-row space <?php echo neatline_getExistingDataStatusForCheckBox($neatline, $item, 'space'); ?>">
                <img src="<?php echo img('space_icon.png'); ?>" class="<?php echo neatline_getRecordStatusForIcon($neatline, $item, 'space'); ?>" />
            </td>
            <td class="col-2 col-row time <?php echo neatline_getExistingDataStatusForCheckBox($neatline, $item, 'time'); ?>">
                <img src="<?php echo img('time_icon.png'); ?>" class="<?php echo neatline_getRecordStatusForIcon($neatline, $item, 'time'); ?>" />
            </td>
        </tr>

        <tr class="item-details">
            <td colspan="3">
                <?php echo $this->partial('data/_item_details.php', array(
                    'item' => $item,
                    'neatline' => $neatline
                )); ?>
            </td>
        </tr>

    <?php endforeach; ?>

</table>

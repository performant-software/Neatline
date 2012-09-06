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
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<table id="items-table" cellspacing="0" cellpadding="0">

    <thead>
        <tr>
            <td></td>
            <td class="col-1"></td>
            <td class="col-2"></td>
            <td class="col-3"></td>
        </tr>
    </thead>

    <tbody>

    <tr id="neatline-header" class="header-row <?php if (!$records) { echo 'hidden'; } ?>">
    <td class="neatline-bar"><?php echo __('Neatline Records'); ?></td>
        <td class="col-1 neatline-bar"></td>
        <td class="col-2 neatline-bar"></td>
        <td class="col-3 neatline-bar"></td>
    </tr>

    <?php foreach ($records as $record): ?>

        <tr class="item-row" recordid="<?php echo $record->id; ?>" itemid="">
            <td class="item-title">
                <span class="item-title-text"><?php echo $record->getTitleOrDescription(); ?></span>
                <span class="item-title-fader"></span>
            </td>
            <td class="col-1 col-row items">
                <input type="checkbox" <?php echo ($record->items_active == 1) ? 'checked' : ''; ?> />
            </td>
            <td class="col-2 col-row space">
                <input type="checkbox" <?php echo ($record->space_active == 1) ? 'checked' : ''; ?> />
            </td>
            <td class="col-3 col-row time">
                <input type="checkbox" <?php echo ($record->time_active == 1) ? 'checked' : ''; ?> />
            </td>
        </tr>

        <tr class="edit-form"><td class="edit-form-container" colspan="4"></td></tr>

    <?php endforeach; ?>

    <tr id="omeka-header" class="header-row <?php if (count($items) == 0) { echo 'hidden'; } ?>">
      <td class="neatline-bar"><?php echo __('Omeka Records'); ?></td>
        <td class="col-1 neatline-bar"></td>
        <td class="col-2 neatline-bar"></td>
        <td class="col-3 neatline-bar"></td>
    </tr>

    <?php foreach ($items as $item): ?>

        <tr class="item-row" recordid="<?php echo $neatline->getRecordIdByItem($item); ?>" itemid="<?php echo $item->id; ?>">
            <td class="item-title">
                <span class="item-title-text"><?php echo metadata($item, array('Dublin Core', 'Title')); ?></span>
                <span class="item-title-fader"></span>
            </td>
            <td class="col-1 col-row items">
                <input type="checkbox" <?php echo $neatline->getRecordStatus($item, 'items')? 'checked' : ''; ?> />
            </td>
            <td class="col-2 col-row space">
                <input type="checkbox" <?php echo $neatline->getRecordStatus($item, 'space')? 'checked' : ''; ?> />
            </td>
            <td class="col-3 col-row time">
                <input type="checkbox" <?php echo $neatline->getRecordStatus($item, 'time')? 'checked' : ''; ?> />
            </td>
        </tr>

        <tr class="edit-form"><td class="edit-form-container" colspan="4"></td></tr>

    <?php endforeach; ?>
    </tbody>

</table>

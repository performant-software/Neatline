<?php echo link_to_item('Open item home page in new tab', array(
    'class' => 'item-dc-link',
    'target' => '_blank'
), 'show', $item); ?>

<?php echo show_item_metadata(array(), $item); ?>

<!-- The following returns all of the files associated with an item. -->
<div id="itemfiles" class="element">
    <h3><?php echo __('Files'); ?></h3>
    <div class="element-text"><?php echo display_files_for_item(array(), array(), $item); ?></div>
</div>

<!-- The following prints a citation for this item. -->
<div id="item-citation" class="element">
    <h3><?php echo __('Citation'); ?></h3>
    <div class="element-text"><?php echo item_citation($item); ?></div>
</div>

<?php echo link_to_item('Open item home page in new tab', array(
    'class' => 'item-dc-link',
    'target' => '_blank'
), 'show', $item); ?>

<?php echo all_element_texts($item); ?>

<!-- The following returns all of the files associated with an item. -->
<div id="itemfiles" class="element">
    <h3><?php echo __('Files'); ?></h3>
    <div class="element-text"><?php echo files_for_item(array(), array(), $item); ?></div>
</div>

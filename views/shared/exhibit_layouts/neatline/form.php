<?php
$formStem = $block->getFormStem();
$options  = $block->getOptions();
?>
<div class="neatline-id">
    <?php
    echo $this->formLabel("{$formStem}[options][neatline-id]",
        __('Select a Neatline'));
    echo $this->formSelect("{$formStem}[options][neatline-id]",
        @$options['neatline-id'], array(),
        get_table_options('NeatlineExhibit'));
    ?>
</div>

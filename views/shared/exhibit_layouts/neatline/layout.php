<?php
if (!array_key_exists('neatline-id', $options)) {
    return;
}

$neatline = get_record_by_id('NeatlineExhibit', $options['neatline-id']);
if (!$neatline) {
    return;
}

set_current_record('neatline_exhibit', $neatline);

?>
<iframe height="<?php echo get_option('neatline_exhibitblock_height') ? get_option('neatline_exhibitblock_height') : '500px'?>" src="<?php echo nl_getExhibitUrl($neatline, "fullscreen")  ?>" seamless>
</iframe>

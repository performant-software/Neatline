<div id="neatline-header">

    <img id="neatline-logo" src="<?php echo img('neatline-logo-rgb-small.png'); ?>" />

    <ul id="section-nav" class="navigation">
        <?php echo nav(array(
            'Neatlines' => uri('neatline-exhibits'),
            'Maps' => uri('neatline-exhibits/maps'),
            'Timelines' => uri('neatline-exhibits/timelines')
        ))?>
    </ul>

    <p class="add-button">
        <a class="add" href="<?php echo html_escape(uri($add_button_uri)); ?>"><?php echo $add_button_text; ?></a>
    </p>

</div>

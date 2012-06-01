<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * Partial template for the public fullscreen top bar.
 *
 */
?>

<div id="topbar" class="neatline-bar topbar">

    <a href="http://neatline.org">
      <img id="neatline-logo" src="<?php echo img('neatline-logo-editor.png'); ?>" />
    </a>
    <span class="top-bar-title"><?php echo $neatline->name; ?></span>

<?php echo $this->partial('public/_topbar_navigation.php',
    array(
        'neatline' => $neatline,
        'layers' => $layers
    )
);
?>

</div>

<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * The editor interior markup, without the header and footer. Broken away
 * from the top-level template so that it can be rendered as a fixture.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!-- Editor. -->
<div id="editor"></div>

<!-- Exhibit. -->
<?php echo $this->partial('neatline/partials/neatline.php'); ?>

<!-- Loader. -->
<?php echo $this->partial('exhibits/partials/loader.php'); ?>

<!-- Strings. -->
<?php echo $this->partial('exhibits/partials/strings.php'); ?>

<!-- Underscore templates. -->
<?php echo $this->partial('exhibits/underscore/menu.php'); ?>
<?php echo $this->partial('exhibits/underscore/styles.php'); ?>
<?php echo $this->partial('exhibits/underscore/record.php'); ?>
<?php echo $this->partial('exhibits/underscore/records.php'); ?>
<?php echo $this->partial('exhibits/underscore/search.php'); ?>

<!-- Plugin templates. ->
<?php fire_plugin_hook('neatline_editor_underscore', array(
  'exhibit' => _nl_exhibit()
)); ?>

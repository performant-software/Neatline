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
<?php echo $this->partial('neatline/_neatline.php', array(
  'exhibit' => $exhibit
)); ?>

<!-- Strings. -->
<?php echo $this->partial('exhibits/_strings.php'); ?>

<!-- Underscore templates. -->
<?php $_ = 'exhibits/underscore/'; ?>
<?php $e = array('exhibit' => $exhibit ); ?>
<?php echo $this->partial($_.'_exhibit_menu.php', $e); ?>
<?php echo $this->partial($_.'_exhibit_styles.php', $e); ?>
<?php echo $this->partial($_.'_record_form.php', $e); ?>
<?php echo $this->partial($_.'_record_list.php'); ?>
<?php echo $this->partial($_.'_record_text.php'); ?>
<?php echo $this->partial($_.'_pagination.php'); ?>
<?php echo $this->partial($_.'_search.php'); ?>
<?php fire_plugin_hook('neatline_templates', $e);

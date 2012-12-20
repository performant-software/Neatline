<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Content management shell in editor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<div id="editor"></div>

<!-- Underscore templates. -->
<?php echo $this->partial('index/_record_row.php'); ?>
<?php echo $this->partial('index/_record_form.php'); ?>
<?php echo $this->partial('index/_lists.php', array(
  'exhibit' => $exhibit));
?>

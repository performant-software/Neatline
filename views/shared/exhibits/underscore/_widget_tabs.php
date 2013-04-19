<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit widget tabs.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php
  $tabs = (array) _nl_getExhibitTabs(_nl_exhibit());
  foreach ($tabs as $label => $slug):
?>

  <li class="tab" data-slug="<?php echo $slug; ?>">
    <a href="#<?php echo $slug; ?>"><?php echo $label; ?></a>
  </li>

<?php endforeach; ?>

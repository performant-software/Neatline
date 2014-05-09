<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<legend>Link to Omeka</legend>

<!-- Search box. -->
<input name="item-search" class="form-control" />

<!-- Explanation. -->
<div rv-hide="record:item" class="alert alert-info info">
  <p><strong>No item currently selected.</strong> Each Neatline record can be
  linked with an item in the Omeka collection. Once an item has been selected,
  the item's medatata will be displayed below the Neatline "Title" and "Body"
  fields wherever the record is displayed (eg., in pop-up bubbles on the map),
  along with a link back to the item's default page in Omeka.</p>

  <p>To select an item, use the dropdown box to browse the entire collection
  or search for individual keywords. Once an item is selected, the metadata
  output will be previewed in this space.</p>
</div>

<!-- Preview well. -->
<div rv-show="record:item" rv-html="record:item"
  class="alert alert-info preview"></div>

<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search box in editor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="search-template" type="text/templates">
  <input type="text" placeholder="Search" />
  <div class="pagination">
    <ul>
      <li><a class="next" href="#">«</a></li>
      <li><a class="prev" href="#">»</a></li>
    </ul>
    <div class="pagination-offset">
      <span class="start">0</span>&ndash;<span class="end">0</span> of
      <span class="total">0</span>
    </div>
  </div>
</script>

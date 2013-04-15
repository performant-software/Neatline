<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Static bubble partial.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<script id="static-bubble-template" type="text/templates">
  <a name="close" class="close">&times;</a>
  <div class="title"><%= record.get('title') %></div>
  <div class="body"><%= record.get('body') %></div>
</script>

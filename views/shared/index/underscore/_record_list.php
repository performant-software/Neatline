<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record list underscore template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="record-list-template" type="text/templates">
  <a data-href="record.id|recordLink" class="record" data-each-record="records">
      <span class="title" data-text="record.title"></span>
      <span class="body" data-text="record.body"></span>
  </a>
</script>

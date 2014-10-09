<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="static-bubble-template" type="text/template">

  <!-- Close "X". -->
  <a name="close" class="close">&times;</a>

  <!-- Title. -->
  <div class="title" rv-html="record:title"></div>

  <!-- Body / Item. -->
  <div class="content body" rv-html="record:body" rv-show="record:body"></div>
  <hr class="content" rv-show="record:item" />
  <div class="content item" rv-html="record:item" rv-show="record:item"></div>

</script>

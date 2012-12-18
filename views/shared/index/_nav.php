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

<ul class="nav nav-pills">

  <li>
    <a href="#records-list" data-toggle="tab">
      <i class="icon-file"></i> Records
    </a>
  </li>

  <li>
    <a href="#tags-list" data-toggle="tab">
      <i class="icon-tag"></i> Tags
    </a>
  </li>

  <li class="dropdown">

    <a class="dropdown-toggle" href="#" data-toggle="dropdown">
      Actions <b class="caret"></b>
    </a>

    <ul class="dropdown-menu" role="menu">

      <li>
        <a href="#">
          <i class="icon-file"></i> New Record
        </a>
      </li>

      <li>
        <a href="#">
          <i class="icon-tag"></i> New Tag
        </a>
      </li>

      <li class="divider"></li>

      <li>
        <a href="#">
          <i class="icon-screenshot"></i> Save Focus
        </a>
      </li>

    </ul>

  </li>
</ul>

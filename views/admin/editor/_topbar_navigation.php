<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Partial template for the editor top bar.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<ul class="nav">

    <li class="dropdown">
        <a href="" id="configure-map-button" class="dropdown-toggle">Map Settings</a>
        <div id="configure-map" class="dropdown-content">
            <?php echo $this->partial('editor/_configure_map.php'); ?>
        </div>
    </li>

    <li class="dropdown">
        <a href="" id="configure-layout-button" class="dropdown-toggle">Configure Layout</a>
        <div id="configure-layout" class="dropdown-content">
            <?php echo $this->partial('editor/_configure_layout.php'); ?>
        </div>
    </li>

    <li class="dropdown">
        <a class="omeka-logo" href="<?php echo html_escape(uri('neatline-exhibits')); ?>">
            <img id="omeka-logo" src="<?php echo img('back-to-omeka-white.png'); ?>" />
        </a>
    </li>

</ul>

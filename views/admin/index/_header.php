<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Header partial template for logo, nav, and add button. For the navigation, the
 * template uses raw markup instead of the nav() helper because of an inflexibility
 * in the is_current_uri() function, which in this situation interprets the
 * 'neatline-exhibits' route as being active in all three cases, which causes the
 * 'Neatlines' tab to have the current class in all cases, which is not appropriate.
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

<div id="neatline-header">

    <h1>Neatline | <?php echo $subtitle; ?></h1>

    <p class="add-button">
        <a class="add" href="<?php echo html_escape(uri($add_button_uri)); ?>">
            <?php echo $add_button_text; ?>
        </a>
    </p>

</div>

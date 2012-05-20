<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Helper function tests.
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


if (!defined('NEATLINE_PLUGIN_DIR')) {
    define('NEATLINE_PLUGIN_DIR', dirname(__FILE__) . '/../..');
}

require_once APP_DIR . '/models/Plugin.php';
require_once NEATLINE_PLUGIN_DIR . '/NeatlinePlugin.php';
require_once NEATLINE_PLUGIN_DIR . '/tests/Neatline_Test_AppTestCase.php';


class Neatline_HelpersTest extends Omeka_Test_AppTestCase
{

    /**
     * Instantiate the helper class, install the plugins, get the database.
     *
     * @return void.
     */
    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();
        $this->db = get_db();

    }

    /**
     * setStyleDefaults should set system defaults for all style parameters,
     * typecasting where necessary.
     *
     * @return void.
     */
    public function testSetStyleDefaults()
    {

        // Call.
        neatline_setStyleDefaults();

        // Check for option presence.
        $this->assertNotNull(get_option('vector_color'));
        $this->assertNotNull(get_option('stroke_color'));
        $this->assertNotNull(get_option('highlight_color'));
        $this->assertNotNull(get_option('vector_opacity'));
        $this->assertNotNull(get_option('stroke_opacity'));
        $this->assertNotNull(get_option('stroke_width'));
        $this->assertNotNull(get_option('point_radius'));
        $this->assertNotNull(get_option('h_percent'));
        $this->assertNotNull(get_option('v_percent'));
        $this->assertNotNull(get_option('timeline_zoom'));
        $this->assertNotNull(get_option('context_band_unit'));
        $this->assertNotNull(get_option('context_band_height'));

        // Check for integer typecasting.
        $this->assertTrue(is_int(get_option('vector_opacity')));
        $this->assertTrue(is_int(get_option('stroke_opacity')));
        $this->assertTrue(is_int(get_option('stroke_width')));
        $this->assertTrue(is_int(get_option('point_radius')));
        $this->assertTrue(is_int(get_option('h_percent')));
        $this->assertTrue(is_int(get_option('timeline_zoom')));

    }

}

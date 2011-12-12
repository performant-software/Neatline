<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Public controller integration tests.
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

<?php

class Neatline_PublicControllerTest extends Omeka_Test_AppTestCase
{

    protected $_isAdminTest = false;

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
     * The show view should render the base markup for the editing application.
     * If the exhibit has no map, then there should not be a map object in the view.
     *
     * @return void.
     */
    public function testShowWithoutMap()
    {

        // Create entities.
        $exhibit = $this->helper->_createNeatline();

        // Hit the route and capture the view.
        $this->dispatch('neatline/' . $exhibit->id);
        $this->assertResponseCode(200);
        $v = __v();

        // Check for the template variables.
        $this->assertNotNull($v->neatline);
        $this->assertNotNull($v->neatlineData);
        $this->assertNull($v->map);

        // Check the construction of the data array.
        $this->assertTrue($v->neatlineData['public']);

        $this->assertEquals(
            $v->neatlineData['neatline']->id,
            $exhibit->id
        );

        $this->assertEquals(
            $v->neatlineData['dataSources']['timeline'],
            neatline_getTimelineDataUrl($exhibit->id)
        );

        $this->assertEquals(
            $v->neatlineData['dataSources']['map'],
            neatline_getMapDataUrl($exhibit->id)
        );

        $this->assertEquals(
            $v->neatlineData['dataSources']['undated'],
            neatline_getUndatedItemsDataUrl($exhibit->id)
        );

    }

    /**
     * The index view should render the base markup for the editing application.
     * If the exhibit has a Geoserver-based map, then the map object in the view.
     *
     * @return void.
     */
    public function testShowWithGeoserverMap()
    {



    }

    /**
     * The index view should render the base markup for the editing application.
     * If the exhibit has a file-based map, then the map object in the view.
     *
     * @return void.
     */
    public function testShowWithFileMap()
    {



    }

}

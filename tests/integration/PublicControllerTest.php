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

        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();
        $this->db = get_db();
        parent::setUp();

    }

    /**
     * .
     *
     * @return void.
     */
    public function testShowWithoutMap()
    {



    }

    /**
     * .
     *
     * @return void.
     */
    public function testShowWithGeoserverMap()
    {



    }

    /**
     * .
     *
     * @return void.
     */
    public function testShowWithFileMap()
    {



    }

    /**
     * .
     *
     * @return void.
     */
    public function testFullscreenWithoutMap()
    {



    }

    /**
     * .
     *
     * @return void.
     */
    public function testFullscreenWithGeoserverMap()
    {



    }

    /**
     * .
     *
     * @return void.
     */
    public function testFullscreenWithFileMap()
    {



    }

    /**
     * .
     *
     * @return void.
     */
    public function testEmbedWithoutMap()
    {



    }

    /**
     * .
     *
     * @return void.
     */
    public function testEmbedWithGeoserverMap()
    {



    }

    /**
     * .
     *
     * @return void.
     */
    public function testEmbedWithFileMap()
    {



    }

}

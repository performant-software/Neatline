<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Data controller integration tests.
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

class Neatline_DataControllerTest extends Omeka_Test_AppTestCase
{

    // Testing parameters.
    private static $__testParams = array(
        'title' => 'Test Title',
        'description' => 'Test description.',
        'start_date' => 'April 26, 1564',
        'start_time' => '6:00 AM',
        'end_date' => 'April 23, 1616',
        'end_time' => '6:00 AM',
        'vector_color' => '#ffffff',
        'left_percent' => 0,
        'right_percent' => 100,
        'geocoverage' => '[POINT(-1.0, 1.0)]',
        'space_active' => true,
        'time_active' => true
    );

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
     * The /openlayers route should return a well-formed JSON string for
     * the map block.
     *
     * @return void.
     */
    public function testOpenlayers()
    {

        // Create an exhibit and items.
        $neatline = $this->helper->_createNeatline();
        $item1 = $this->helper->_createItem();
        $item2 = $this->helper->_createItem();

        // Create two records.
        $record1 = new NeatlineDataRecord($item1, $neatline);
        $record2 = new NeatlineDataRecord($item2, $neatline);

        // Populate map-relevant attributes.
        $record1->title = 'Item 1 Title';
        $record2->title = 'Item 2 Title';
        $record1->slug = 'slug-1';
        $record2->slug = 'slug-2';
        $record1->vector_color = '#ffffff';
        $record2->vector_color = '#000000';
        $record1->vector_opacity = 60;
        $record2->vector_opacity = 40;
        $record1->stroke_opacity = 60;
        $record2->stroke_opacity = 40;
        $record1->stroke_color = '#ffffff';
        $record2->stroke_color = '#000000';
        $record1->stroke_width = 3;
        $record2->stroke_width = 2;
        $record1->point_radius = 3;
        $record2->point_radius = 2;
        $record1->geocoverage = 'POINT(1,0)';
        $record2->geocoverage = 'POINT(0,1)';
        $record1->space_active = 1;
        $record2->space_active = 1;
        $record1->map_bounds = 'BOUND(1)';
        $record2->map_bounds = 'BOUND(2)';
        $record1->map_zoom = 4;
        $record2->map_zoom = 5;
        $record1->start_visible_date = '1864-04-26 14:39:22';
        $record2->start_visible_date = '1964-04-26 14:39:22';
        $record1->end_visible_date = '1916-04-23 12:45:34';
        $record2->end_visible_date = '2016-04-23 12:45:34';
        $record1->save();
        $record2->save();

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/' . $neatline->id . '/data/openlayers');
        $response = $this->getResponse()->getBody('default');

        // Test the raw construction with no available DC values.
        $this->assertContains('"id":' . $record1->id, $response);
        $this->assertContains('"item_id":' . $item1->id, $response);
        $this->assertContains('"title":"Item 1 Title"', $response);
        $this->assertContains('"slug":"slug-1"', $response);
        $this->assertContains('"vector_color":"#ffffff"', $response);
        $this->assertContains('"vector_opacity":60', $response);
        $this->assertContains('"stroke_opacity":60', $response);
        $this->assertContains('"stroke_color":"#ffffff"', $response);
        $this->assertContains('"stroke_width":3', $response);
        $this->assertContains('"point_radius":3', $response);
        $this->assertContains('"bounds":"BOUND(1)"', $response);
        $this->assertContains('"zoom":4', $response);
        $this->assertContains('"wkt":"POINT(1,0)"', $response);
        $this->assertContains('"start_visible_date":"1864-04-26 14:39:22"', $response);
        $this->assertContains('"end_visible_date":"1916-04-23 12:45:34"', $response);
        $this->assertContains('"id":' . $record2->id, $response);
        $this->assertContains('"item_id":' . $item2->id, $response);
        $this->assertContains('"title":"Item 1 Title"', $response);
        $this->assertContains('"slug":"slug-2"', $response);
        $this->assertContains('"vector_color":"#000000"', $response);
        $this->assertContains('"vector_opacity":40', $response);
        $this->assertContains('"stroke_opacity":40', $response);
        $this->assertContains('"stroke_color":"#000000"', $response);
        $this->assertContains('"stroke_width":2', $response);
        $this->assertContains('"point_radius":2', $response);
        $this->assertContains('"bounds":"BOUND(2)"', $response);
        $this->assertContains('"zoom":5', $response);
        $this->assertContains('"wkt":"POINT(0,1)"', $response);
        $this->assertContains('"start_visible_date":"1964-04-26 14:39:22"', $response);
        $this->assertContains('"end_visible_date":"2016-04-23 12:45:34"', $response);

    }

    /**
     * The /simile route should return a well-formed JSON string for the
     * timeline block.
     *
     * @return void.
     */
    public function testSimile()
    {

        // Create an exhibit and items.
        $neatline = $this->helper->_createNeatline();
        $item1 = $this->helper->_createItem();
        $item2 = $this->helper->_createItem();

        // Create two records.
        $record1 = new NeatlineDataRecord($item1, $neatline);
        $record2 = new NeatlineDataRecord($item2, $neatline);

        // Populate map-relevant attributes.
        $record1->title = 'Item 1 Title';
        $record2->title = 'Item 2 Title';
        $record1->slug = 'slug-1';
        $record2->slug = 'slug-2';
        $record1->description = 'Item 1 description.';
        $record2->description = 'Item 2 description.';
        $record1->start_date = '1564-04-26 14:39:22';
        $record2->start_date = '1564-04-26 14:39:22';
        $record1->end_date = '1616-04-23 12:45:34';
        $record2->end_date = '1616-04-23 12:45:34';
        $record1->vector_color = '#ffffff';
        $record2->vector_color = '#000000';
        $record1->left_percent = 0;
        $record2->left_percent = 0;
        $record1->right_percent = 100;
        $record1->right_percent = 100;
        $record1->time_active = 1;
        $record2->time_active = 1;
        $record1->save();
        $record2->save();

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/' . $neatline->id . '/data/simile');
        $response = $this->getResponse()->getBody('default');

        // Check format.
        $this->assertContains(
            '"dateTimeFormat":"iso8601"',
            $response
        );

        $this->assertContains(
            '"events":',
            $response
        );

        $this->assertContains(
            '"eventID":' . $record1->id,
            $response
        );

        $this->assertContains(
            '"title":"' . $record1->title . '"',
            $response
        );

        $this->assertContains(
            '"slug":"' . $record1->slug . '"',
            $response
        );

        $this->assertContains(
            '"description":"' . $record1->description . '"',
            $response
        );

        $this->assertContains(
            '"color":"' . $record1->vector_color . '"',
            $response
        );

        $this->assertContains(
            '"left_ambiguity":' . $record1->left_percent,
            $response
        );

        $this->assertContains(
            '"right_ambiguity":' . $record1->right_percent,
            $response
        );

        $this->assertContains(
            '"start":"1564-04-26 14:39:22"',
            $response
        );

        $this->assertContains(
            '"end":"1616-04-23 12:45:34"',
            $response
        );

        $this->assertContains(
            '"dateTimeFormat":"iso8601"',
            $response
        );

        $this->assertContains(
            '"events":',
            $response
        );

        $this->assertContains(
            '"eventID":' . $record2->id,
            $response
        );

        $this->assertContains(
            '"title":"' . $record2->title . '"',
            $response
        );

        $this->assertContains(
            '"slug":"' . $record2->slug . '"',
            $response
        );

        $this->assertContains(
            '"description":"' . $record2->description . '"',
            $response
        );

        $this->assertContains(
            '"color":"' . $record2->vector_color . '"',
            $response
        );

        $this->assertContains(
            '"left_ambiguity":' . $record2->left_percent,
            $response
        );

        $this->assertContains(
            '"right_ambiguity":' . $record2->right_percent,
            $response
        );

    }

    /**
     * The /udi route should return well-formed markup for the items pane.
     *
     * @return void.
     */
    public function testUdi()
    {

        // Create an exhibit and item.
        $neatline = $this->helper->_createNeatline();

        // Create record1.
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->title = 'Item 1 Title';
        $record1->slug = 'slug-1';
        $record1->description = 'Item 1 description.';
        $record1->items_active = 1;
        $record1->start_visible_date = '1864-04-26 14:39:22';
        $record1->end_visible_date = '1916-04-23 12:45:34';
        $record1->save();

        // Create record2.
        $record2 = new NeatlineDataRecord(null, $neatline);
        $record2->title = 'Item 2 Title';
        $record2->slug = 'slug-2';
        $record2->description = 'Item 2 description.';
        $record2->items_active = 1;
        $record2->start_visible_date = '1964-04-26 14:39:22';
        $record2->end_visible_date = '2016-04-23 12:45:34';
        $record2->save();

        // Hit the route.
        $this->dispatch('neatline-exhibits/' . $neatline->id . '/data/udi');
        $response = $this->getResponse()->getBody('default');

        // JSON -> array.
        $json = json_decode($response);

        // Check.
        $this->assertEquals(
            $json,
            array(
                (object) array(
                    'id' => $record1->id,
                    'title' => 'Item 1 Title',
                    'slug' => 'slug-1',
                    'description' => 'Item 1 description.',
                    'start_visible_date' => '1864-04-26 14:39:22',
                    'end_visible_date' => '1916-04-23 12:45:34'
                ),
                (object) array(
                    'id' => $record2->id,
                    'title' => 'Item 2 Title',
                    'slug' => 'slug-2',
                    'description' => 'Item 2 description.',
                    'start_visible_date' => '1964-04-26 14:39:22',
                    'end_visible_date' => '2016-04-23 12:45:34'
                )
            )
        );

    }

}

<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Editor controller integration tests.
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

class Neatline_EditorControllerTest extends Omeka_Test_AppTestCase
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
        $this->_recordsTable = $this->db->getTable('NeatlineDataRecord');

    }

    /**
     * Hitting the /status route with a well-formed POST should result in the
     * correct data commits to the space_active field in the correct record.
     *
     * @return void.
     */
    public function testSpaceStatusSave()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'neatline_id' => $neatline->id,
                'space_or_time' => 'space',
                'value' => 'true'
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/status');

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Space status should be true, time status unchanged.
        $this->assertEquals($record->space_active, 1);
        $this->assertEquals($record->time_active, 0);

    }

    /**
     * Hitting the /status route with a well-formed POST should result in the
     * correct data commits to the time_active field in the correct record.
     *
     * @return void.
     */
    public function testTimeStatusSave()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'neatline_id' => $neatline->id,
                'space_or_time' => 'time',
                'value' => 'true'
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/status');

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Time status should be true, space status unchanged.
        $this->assertEquals($record->time_active, 1);
        $this->assertEquals($record->space_active, 0);

    }

    /**
     * When there is a Neatline-native data record, the /form route should output
     * a well-formed JSON object with the correct record attributes.
     *
     * @return void.
     */
    public function testForm()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Save form data with update values.
        $this->_recordsTable->saveItemFormData(
            $item,
            $neatline,
            self::$__testParams['title'],
            self::$__testParams['description'],
            self::$__testParams['start_date'],
            self::$__testParams['start_time'],
            self::$__testParams['end_date'],
            self::$__testParams['end_time'],
            self::$__testParams['vector_color'],
            self::$__testParams['left_percent'],
            self::$__testParams['right_percent'],
            self::$__testParams['geocoverage'],
            self::$__testParams['space_active'],
            self::$__testParams['time_active']
        );

        // Form the POST for a space change.
        $this->request->setMethod('GET')
            ->setParams(array(
                'item_id' => $item->id,
                'neatline_id' => $neatline->id
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/form');
        $response = $this->getResponse()->getBody('default');

        // Test the raw construction with no available DC values.
        $this->assertEquals(
            $response,
            '{"title":"' . self::$__testParams['title'] . '",' .
            '"description":"' . self::$__testParams['description'] . '",' .
            '"start_date":"' . self::$__testParams['start_date'] . '",' .
            '"start_time":"' . self::$__testParams['start_time'] . '",' .
            '"end_date":"' . self::$__testParams['end_date'] . '",' .
            '"end_time":"' . self::$__testParams['end_time'] . '",' .
            '"left_percent":' . self::$__testParams['left_percent'] . ',' .
            '"right_percent":' . self::$__testParams['right_percent'] . ',' .
            '"vector_color":"' . self::$__testParams['vector_color'] . '"}'
        );

    }

    /**
     * When form data is saved via the /save route, the controller should return a
     * JSON string that reports the final space and time active statuses that resulted
     * from the data commit.
     *
     * @return void.
     */
    public function testSave()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Save form data with update values.
        $this->_recordsTable->saveItemFormData(
            $item,
            $neatline,
            null,
            null,
            'June 25, 1987',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'neatline_id' => $neatline->id,
                'space_active' => 'false',
                'time_active' => 'false',
                'geocoverage' => 'POINT(0,1)',
                'title' => '',
                'description' => '',
                'start_date' => 'December, 2011',
                'start_time' => '',
                'end_date' => '',
                'end_time' => '',
                'left_percent' => 0,
                'right_percent' => 100,
                'vector_color' => ''
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/save');
        $response = $this->getResponse()->getBody('default');

        // Test the raw construction with no available DC values.
        $this->assertEquals(
            $response,
            '{"space":true,"time":true}'
        );

    }

    /**
     * When form data is saved via the /save route, the controller should return a
     * JSON string that reports the final space and time active statuses that resulted
     * from the data commit.
     *
     * @return void.
     */
    public function testOrder()
    {

        // Create an exhibit, items, and records.
        $neatline = $this->helper->_createNeatline();
        $item1 = $this->helper->_createItem();
        $item2 = $this->helper->_createItem();
        $item3 = $this->helper->_createItem();
        $item4 = $this->helper->_createItem();
        $record1 = new NeatlineDataRecord($item1, $neatline);
        $record2 = new NeatlineDataRecord($item2, $neatline);
        $record3 = new NeatlineDataRecord($item3, $neatline);
        $record4 = new NeatlineDataRecord($item4, $neatline);
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'neatline_id' => $neatline->id,
                'order' => array(
                    $item1->id => 3,
                    $item2->id => 2,
                    $item3->id => 1,
                    $item4->id => 0
                )
            )
        );

        // Hit the order save route.
        $this->dispatch('neatline-exhibits/editor/order');

        // Reget the items.
        $record1 = $this->_recordsTable->getRecordByItemAndExhibit($item1, $neatline);
        $record2 = $this->_recordsTable->getRecordByItemAndExhibit($item2, $neatline);
        $record3 = $this->_recordsTable->getRecordByItemAndExhibit($item3, $neatline);
        $record4 = $this->_recordsTable->getRecordByItemAndExhibit($item4, $neatline);

        // Check the values.
        $this->assertEquals($record1->display_order, 3);
        $this->assertEquals($record2->display_order, 2);
        $this->assertEquals($record3->display_order, 1);
        $this->assertEquals($record4->display_order, 0);



    }

}

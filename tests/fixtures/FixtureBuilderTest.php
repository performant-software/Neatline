<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Special 'test' suite that hits each of the routes in the fixtures controller
 * and saves off the baked markup. Ensures that the front end test suite is always
 * working on real-application HTML.
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

class Neatline_FixtureBuilderTest extends Omeka_Test_AppTestCase
{

    protected $_isAdminTest = false;
    private static $path_to_fixtures = '../spec/javascripts/fixtures/';

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
     * Base Neatline exhibit markup.
     *
     * @return void.
     */
    public function testBuildNeatlineMarkup()
    {

        // Mock exhibit.
        $exhibit = new NeatlineExhibit;
        $exhibit->name = 'Test Exhibit';
        $exhibit->is_map = 1;
        $exhibit->is_timeline = 1;
        $exhibit->is_items = 1;
        $exhibit->save();

        $fixture = fopen(self::$path_to_fixtures . 'neatline-base.html', 'w');

        $this->dispatch('neatline/fixtures/neatlinebase');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

    /**
     * Base scroll arrows markup.
     *
     * @return void.
     */
    public function testBuildScrollArrowsMarkup()
    {

        $fixture = fopen(self::$path_to_fixtures . 'scroll-arrows.html', 'w');

        $this->dispatch('neatline/fixtures/scrollarrows');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

    /**
     * Editor markup.
     *
     * @return void.
     */
    public function testBuildEditorMarkup()
    {

        // Mock tags.
        $tag1 = new Tag;
        $tag1->name = 'tag1';
        $tag1->save();
        $tag2 = new Tag;
        $tag2->name = 'tag2';
        $tag2->save();

        // Mock types.
        $type1 = new ItemType;
        $type1->name = 'type1';
        $type1->save();
        $type2 = new ItemType;
        $type2->name = 'type2';
        $type2->save();

        // Mock collections.
        $col1 = new Collection;
        $col1->name = 'col1';
        $col1->description = 'desc';
        $col1->collectors = 'col';
        $col1->save();
        $col2 = new Collection;
        $col2->name = 'col2';
        $col2->description = 'desc';
        $col2->collectors = 'col';
        $col2->save();

        // Mock item.
        $item = new Item;
        $item->save();

        // Mock file.
        $sql = "INSERT INTO omeka_files (" .
               "item_id," .
               "size," .
               "has_derivative_image," .
               "archive_filename," .
               "original_filename) " .
               "VALUES (" .
               $item->id . ',' .
               "1000," .
               "0," .
               "'test.jpg'," .
               "'hex.jpg')";
        $this->db->query($sql);

        // Mock exhibit.
        $exhibit = new NeatlineExhibit;
        $exhibit->name = 'Test Exhibit';
        $exhibit->is_map = 1;
        $exhibit->is_timeline = 1;
        $exhibit->is_items = 1;
        $exhibit->top_element = 'map';
        $exhibit->items_h_pos = 'right';
        $exhibit->items_v_pos = 'top';
        $exhibit->items_height = 'full';
        $exhibit->h_percent = 50;
        $exhibit->v_percent = 60;
        $exhibit->save();

        $fixture = fopen(self::$path_to_fixtures . 'editor.html', 'w');

        $this->dispatch('neatline/fixtures/editor');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

    /**
     * Public items list markup.
     *
     * @return void.
     */
    public function testBuildPublicItemsList()
    {

        $fixture = fopen(self::$path_to_fixtures . 'public-items-ajax.html', 'w');

        // Mock item.
        $item = new Item;
        $item->save();

        // Mock exhibit.
        $exhibit = new NeatlineExhibit;
        $exhibit->name = 'Test Exhibit';
        $exhibit->is_map = 1;
        $exhibit->is_timeline = 1;
        $exhibit->is_items = 1;
        $exhibit->save();

        // Record 1.
        $record1 = new NeatlineDataRecord();
        $record1->title = 'Title1';
        $record1->description = 'Description 1.';
        $record1->exhibit_id = $exhibit->id;
        $record1->space_active = 1;
        $record1->save();

        // Record 2.
        $record2 = new NeatlineDataRecord();
        $record2->title = 'Title2';
        $record2->description = 'Description 2.';
        $record2->exhibit_id = $exhibit->id;
        $record2->time_active = 1;
        $record2->save();

        // Record 3.
        $record3 = new NeatlineDataRecord();
        $record3->title = 'Title3';
        $record3->description = 'Description 3.';
        $record3->exhibit_id = $exhibit->id;
        $record3->item_id = $item->id;
        $record3->space_active = 1;
        $record3->save();

        // Record 4.
        $record4 = new NeatlineDataRecord();
        $record4->title = 'Title4';
        $record4->exhibit_id = $exhibit->id;
        $record4->item_id = $item->id;
        $record4->time_active = 1;
        $record4->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array('id' => $exhibit->id)
        );

        $this->dispatch('neatline-exhibits/' . $exhibit->id . '/data/udi');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

    /**
     * Editor items list markup.
     *
     * @return void.
     */
    public function testBuildEditorItemsList()
    {

        $fixture = fopen(self::$path_to_fixtures . 'editor-items-ajax.html', 'w');

        // Mock items.
        $item1 = new Item;
        $item1->save();
        $item2 = new Item;
        $item2->save();

        // Mock exhibit.
        $exhibit = new NeatlineExhibit;
        $exhibit->name = 'Test Exhibit';
        $exhibit->is_map = 1;
        $exhibit->is_timeline = 1;
        $exhibit->is_items = 1;
        $exhibit->save();

        // Record 1.
        $record1 = new NeatlineDataRecord();
        $record1->title = 'Title1';
        $record1->description = 'Description 1.';
        $record1->exhibit_id = $exhibit->id;
        $record1->space_active = 1;
        $record1->save();

        // Record 2.
        $record2 = new NeatlineDataRecord();
        $record2->title = 'Title2';
        $record2->description = 'Description 2.';
        $record2->exhibit_id = $exhibit->id;
        $record2->time_active = 1;
        $record2->save();

        // Record 3.
        $record3 = new NeatlineDataRecord();
        $record3->title = 'Title3';
        $record3->description = 'Description 3.';
        $record3->exhibit_id = $exhibit->id;
        $record3->item_id = $item1->id;
        $record3->space_active = 1;
        $record3->save();

        // Record 4.
        $record4 = new NeatlineDataRecord();
        $record4->title = 'Title4';
        $record4->exhibit_id = $exhibit->id;
        $record4->item_id = $item2->id;
        $record4->time_active = 1;
        $record4->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
              'exhibit_id' => $exhibit->id,
              'all' => true
            )
        );

        $this->dispatch('neatline-exhibits/editor/ajax/items');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

    /**
     * Editor form data.
     *
     * @return void.
     */
    public function testBuildFormData()
    {

        $fixture = fopen(self::$path_to_fixtures . 'editor-form-ajax.html', 'w');

        // Mock exhibit.
        $exhibit = new NeatlineExhibit;
        $exhibit->name = 'Test Exhibit';
        $exhibit->is_map = 1;
        $exhibit->is_timeline = 1;
        $exhibit->is_items = 1;
        $exhibit->save();

        // Mock record.
        $record = new NeatlineDataRecord();
        $record->title = 'Test Title';
        $record->description = 'Test description.';
        $record->start_date = 'June 25, 1987';
        $record->start_time = '6:00 am';
        $record->end_date = 'June 26, 1987';
        $record->end_time = '6:01 am';
        $record->vector_color = '#ffffff';
        $record->stroke_color = '#000000';
        $record->highlight_color = '#ffff00';
        $record->vector_opacity = 20;
        $record->stroke_opacity = 80;
        $record->stroke_width = 3;
        $record->point_radius = 5;
        $record->exhibit_id = $exhibit->id;
        $record->space_active = 1;
        $record->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
              'exhibit_id' => $exhibit->id,
              'record_id' => $record->id,
            )
        );

        $this->dispatch('neatline-exhibits/editor/ajax/form');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

}

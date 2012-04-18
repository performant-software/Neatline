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

if (!defined('NEATLINE_PLUGIN_DIR')) {
    define('NEATLINE_PLUGIN_DIR', dirname(__FILE__) . '/../..');
}

require_once APP_DIR . '/models/Plugin.php';
require_once NEATLINE_PLUGIN_DIR . '/NeatlinePlugin.php';
require_once NEATLINE_PLUGIN_DIR . '/tests/Neatline_Test_AppTestCase.php';

class Neatline_FixtureBuilderTest extends Omeka_Test_AppTestCase
{

    protected $_isAdminTest = false;
    private $path_to_fixtures = null;

    /**
     * Instantiate the helper class, install the plugins, get the database.
     *
     * @return void.
     */
    public function setUp()
    {

        parent::setUp();

        $this->path_to_fixtures = NEATLINE_PLUGIN_DIR . '/spec/javascripts/fixtures/';

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
        $exhibit = $this->helper->_createNeatline();

        $fixture = fopen($this->path_to_fixtures . 'neatline-base.html', 'w');

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

        $fixture = fopen($this->path_to_fixtures . 'scroll-arrows.html', 'w');

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
        $exhibit = $this->helper->_createNeatline();
        $exhibit->top_element = 'map';
        $exhibit->items_h_pos = 'right';
        $exhibit->items_v_pos = 'top';
        $exhibit->items_height = 'full';
        $exhibit->h_percent = 50;
        $exhibit->v_percent = 60;
        $exhibit->save();

        $fixture = fopen($this->path_to_fixtures . 'editor.html', 'w');

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

        $fixture = fopen($this->path_to_fixtures . 'public-items-ajax.html', 'w');

        // Mock item.
        $item = new Item;
        $item->save();

        // Mock exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Record 1.
        $record1 = new NeatlineDataRecord();
        $record1->title = 'Title1';
        $record1->description = 'Description 1.';
        $record1->exhibit_id = $exhibit->id;
        $record1->items_active = 1;
        $record1->save();

        // Record 2.
        $record2 = new NeatlineDataRecord();
        $record2->title = 'Title2';
        $record2->description = 'Description 2.';
        $record2->exhibit_id = $exhibit->id;
        $record2->items_active = 1;
        $record2->save();

        // Record 3.
        $record3 = new NeatlineDataRecord();
        $record3->title = 'Title3';
        $record3->description = 'Description 3.';
        $record3->exhibit_id = $exhibit->id;
        $record3->item_id = $item->id;
        $record3->items_active = 1;
        $record3->save();

        // Record 4.
        $record4 = new NeatlineDataRecord();
        $record4->title = 'Title4';
        $record4->exhibit_id = $exhibit->id;
        $record4->item_id = $item->id;
        $record4->items_active = 1;
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

    /*
     * Editor items list markup.
     *
     * @return void.
     */
    public function testBuildEditorItemsList()
    {

        $fixture = fopen($this->path_to_fixtures . 'editor-items-ajax.html', 'w');

        // Mock items.
        $item1 = new Item;
        $item1->save();
        $item2 = new Item;
        $item2->save();
        $item3 = new Item;
        $item3->save();

        // Mock exhibit.
        $exhibit = $this->helper->_createNeatline();
        $exhibit->query = serialize(
            array('range' => $item1->id . '-' . $item3->id)
        );
        $exhibit->save();

        // Record 1.
        $record1 = new NeatlineDataRecord(null, $exhibit);
        $record1->title = 'Title1';
        $record1->description = 'Description 1.';
        $record1->space_active = 1;
        $record1->save();

        // Record 2.
        $record2 = new NeatlineDataRecord(null, $exhibit);
        $record2->title = 'Title2';
        $record2->description = 'Description 2.';
        $record2->time_active = 1;
        $record2->save();

        // Record 3.
        $record3 = new NeatlineDataRecord($item1, $exhibit);
        $record3->description = 'Description 3.';
        $record3->space_active = 1;
        $record3->save();

        // Record 4.
        $record4 = new NeatlineDataRecord($item2, $exhibit);
        $record4->time_active = 1;
        $record4->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
              'exhibit_id' => $exhibit->id
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

        $fixture = fopen($this->path_to_fixtures . 'editor-form-ajax.html', 'w');

        // Mock exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Mock record.
        $record = new NeatlineDataRecord();
        $record->title = 'Test Title';
        $record->slug = 'test-slug';
        $record->description = 'Test description.';
        $record->start_date = 'June 25, 1987';
        $record->end_date = 'June 26, 1987';
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

    /*
     * Timeline JSON.
     *
     * @return void.
     */
    public function testBuildTimelineData()
    {

        $fixture = fopen($this->path_to_fixtures . 'timeline-data-ajax.html', 'w');

        // Mock items.
        $item1 = new Item;
        $item1->save();
        $item2 = new Item;
        $item2->save();

        // Mock exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Record 1.
        $record1 = new NeatlineDataRecord();
        $record1->title = 'Title1';
        $record1->description = 'Description 1.';
        $record1->exhibit_id = $exhibit->id;
        $record1->time_active = 1;
        $record1->start_date = 'April 26, 1564';
        $record1->save();

        // Record 2.
        $record2 = new NeatlineDataRecord();
        $record2->title = 'Title2';
        $record2->description = 'Description 2.';
        $record2->exhibit_id = $exhibit->id;
        $record2->time_active = 1;
        $record1->start_date = 'April 28, 1564';
        $record2->save();

        // Record 3.
        $record3 = new NeatlineDataRecord();
        $record3->title = 'Title3';
        $record3->description = 'Description 3.';
        $record3->exhibit_id = $exhibit->id;
        $record3->item_id = $item1->id;
        $record3->time_active = 1;
        $record1->start_date = 'May 28, 1864';
        $record1->end_date = 'May 28, 1865';
        $record3->save();

        // Record 4.
        $record4 = new NeatlineDataRecord();
        $record4->title = 'Title4';
        $record4->exhibit_id = $exhibit->id;
        $record4->item_id = $item2->id;
        $record4->time_active = 1;
        $record1->start_date = 'May 28, 1864';
        $record1->end_date = 'May 28, 1865';
        $record4->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
              'id' => $exhibit->id
            )
        );

        $this->dispatch('neatline-exhibits/' . $exhibit->id . '/data/simile');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

    /*
     * Exhibit add/edit form.
     *
     * @return void.
     */
    public function testBuildExhibitForm()
    {

        $fixture = fopen($this->path_to_fixtures . 'add-form.html', 'w');

        $this->dispatch('neatline/fixtures/exhibitform');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

}

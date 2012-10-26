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
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class Neatline_FixtureBuilderTest extends Neatline_Test_AppTestCase
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
    }

    /**
     * Base Neatline exhibit markup.
     *
     * @return void.
     */
    public function testBuildNeatlineMarkup()
    {

        // Mock exhibit.
        $exhibit = $this->_createNeatline();

        $fixture = fopen($this->path_to_fixtures . 'neatline-base.html', 'w');

        $this->dispatch('neatline/fixtures/neatlinebase');
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

        // Mock exhibit.
        $exhibit = $this->_createNeatline();
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
        $exhibit = $this->_createNeatline();

        // Record 1.
        $record1 = new NeatlineRecord();
        $record1->title = 'Title1';
        $record1->description = 'Description 1.';
        $record1->exhibit_id = $exhibit->id;
        $record1->items_active = 1;
        $record1->save();

        // Record 2.
        $record2 = new NeatlineRecord();
        $record2->title = 'Title2';
        $record2->description = 'Description 2.';
        $record2->exhibit_id = $exhibit->id;
        $record2->items_active = 1;
        $record2->save();

        // Record 3.
        $record3 = new NeatlineRecord();
        $record3->title = 'Title3';
        $record3->description = 'Description 3.';
        $record3->exhibit_id = $exhibit->id;
        $record3->item_id = $item->id;
        $record3->items_active = 1;
        $record3->save();

        // Record 4.
        $record4 = new NeatlineRecord();
        $record4->title = 'Title4';
        $record4->exhibit_id = $exhibit->id;
        $record4->item_id = $item->id;
        $record4->items_active = 1;
        $record4->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array('id' => $exhibit->id)
        );

        $this->dispatch('neatline-exhibits/udi/' . $exhibit->id);
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
        $exhibit = $this->_createNeatline();
        $exhibit->query = serialize(
            array('range' => $item1->id . '-' . $item3->id)
        );
        $exhibit->save();

        // Record 1.
        $record1 = new NeatlineRecord(null, $exhibit);
        $record1->title = 'Title1';
        $record1->description = 'Description 1.';
        $record1->space_active = 1;
        $record1->save();

        // Record 2.
        $record2 = new NeatlineRecord(null, $exhibit);
        $record2->title = 'Title2';
        $record2->description = 'Description 2.';
        $record2->time_active = 1;
        $record2->save();

        // Record 3.
        $record3 = new NeatlineRecord($item1, $exhibit);
        $record3->description = 'Description 3.';
        $record3->space_active = 1;
        $record3->save();

        // Record 4.
        $record4 = new NeatlineRecord($item2, $exhibit);
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

        // Mock exhibit and item.
        $exhibit = $this->_createNeatline();
        $item = $this->_createItem();

        // Mock record.
        $record1 = new NeatlineRecord($item, $exhibit);
        $record1->title = 'Test Title 1';
        $record1->slug = 'test-slug';
        $record1->description = 'Test description.';
        $record1->start_date = 'June 25, 1987';
        $record1->end_date = 'June 26, 1987';
        $record1->start_visible_date = 'June 27, 1987';
        $record1->end_visible_date = 'June 28, 1987';
        $record1->vector_color = '#ffffff';
        $record1->stroke_color = '#000000';
        $record1->highlight_color = '#ffff00';
        $record1->vector_opacity = 20;
        $record1->stroke_opacity = 80;
        $record1->graphic_opacity = 100;
        $record1->stroke_width = 3;
        $record1->point_radius = 5;
        $record1->exhibit_id = $exhibit->id;
        $record1->space_active = 1;
        $record1->parent_record_id = 2;
        $record1->use_dc_metadata = 0;
        $record1->show_bubble = 1;
        $record1->save();

        // Mock records for parent record select.
        $record2 = new NeatlineRecord();
        $record2->exhibit_id = $exhibit->id;
        $record2->title = 'Test Title 2';
        $record2->save();
        $record3 = new NeatlineRecord();
        $record3->exhibit_id = $exhibit->id;
        $record3->title = 'Test Title 3';
        $record3->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
              'exhibit_id' => $exhibit->id,
              'record_id' => $record1->id,
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
        $exhibit = $this->_createNeatline();

        // Record 1.
        $record1 = new NeatlineRecord();
        $record1->title = 'Title1';
        $record1->description = 'Description 1.';
        $record1->exhibit_id = $exhibit->id;
        $record1->time_active = 1;
        $record1->start_date = 'April 26, 1564';
        $record1->save();

        // Record 2.
        $record2 = new NeatlineRecord();
        $record2->title = 'Title2';
        $record2->description = 'Description 2.';
        $record2->exhibit_id = $exhibit->id;
        $record2->time_active = 1;
        $record1->start_date = 'April 28, 1564';
        $record2->save();

        // Record 3.
        $record3 = new NeatlineRecord();
        $record3->title = 'Title3';
        $record3->description = 'Description 3.';
        $record3->exhibit_id = $exhibit->id;
        $record3->item_id = $item1->id;
        $record3->time_active = 1;
        $record1->start_date = 'May 28, 1864';
        $record1->end_date = 'May 28, 1865';
        $record3->save();

        // Record 4.
        $record4 = new NeatlineRecord();
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

        $this->dispatch('neatline-exhibits/simile/' . $exhibit->id);
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

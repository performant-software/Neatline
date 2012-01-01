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
?>

<?php

class Neatline_FixtureBuilderTest extends Omeka_Test_AppTestCase
{

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

        $fixture = fopen(self::$path_to_fixtures . 'neatline-base.html', 'w');

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
        $exhibit->image_id = 1;
        $exhibit->save();

        $fixture = fopen(self::$path_to_fixtures . 'editor.html', 'w');

        $this->dispatch('neatline/fixtures/editor');
        $response = $this->getResponse()->getBody('default');

        fwrite($fixture, $response);
        fclose($fixture);

    }

}

<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Markup emitter for the Jasmine test suite.
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

class Neatline_FixturesController extends Omeka_Controller_Action
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {

        // Get tables.
        $this->_itemsTable =        $this->getTable('Item');
        $this->_filesTable =        $this->getTable('File');
        $this->_neatlinesTable =    $this->getTable('NeatlineExhibit');
        $this->_recordsTable =      $this->getTable('NeatlineDataRecord');
        $this->_mapsTable =         $this->getTable('NeatlineMapsMap');
        $this->_timelinesTable =    $this->getTable('NeatlineTimeTimeline');
        $this->_statusesTable =     $this->getTable('NeatlineRecordStatus');

    }

    /**
     * Base exhibit markup.
     *
     * @return void
     */
    public function neatlinebaseAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Render.
        echo $this->view->partial('neatline/_neatline.php', array(
            'neatline' =>           array(),
            'public' =>             true,
            'dataSources' =>        array(),
        ));

    }

    /**
     * Item browser markup.
     *
     * @return void
     */
    public function itembrowserAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Mock tags.
        $tags = array(
            (object) array('id' => 1, 'name' => 'Tag1'),
            (object) array('id' => 2, 'name' => 'Tag2'),
            (object) array('id' => 3, 'name' => 'Tag3'),
        );

        // Mock types.
        $types = array(
            (object) array('id' => 1, 'name' => 'Type1'),
            (object) array('id' => 2, 'name' => 'Type2'),
            (object) array('id' => 3, 'name' => 'Type3'),
        );

        // Mock collections.
        $collections = array(
            (object) array('id' => 1, 'name' => 'Coll1'),
            (object) array('id' => 2, 'name' => 'Coll2'),
            (object) array('id' => 3, 'name' => 'Coll3'),
        );

        // Render.
        echo $this->view->partial('editor/_item_browser.php', array(
            'tags' =>               $tags,
            'types' =>              $types,
            'collections' =>        $collections
        ));

    }

}

<?php
/**
 * Test suite parent class.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

require_once dirname(__FILE__) . '/../NeatlinePlugin.php';

class Neatline_Test_AppTestCase extends Omeka_Test_AppTestCase
{

    /**
     * Bootstrap the plugin.
     *
     * @return void.
     */
    public function setUp()
    {

        parent::setUp();

        // Authenticate and set the current user.
        $this->user = $this->db->getTable('User')->find(1);
        $this->_authenticateUser($this->user);

        // Set up Neatline.
        $neatline_plugin_broker = get_plugin_broker();
        $this->_addNeatlinePluginHooksAndFilters($neatline_plugin_broker, 'Neatline');
        $neatline_plugin_helper = new Omeka_Test_Helper_Plugin;
        $neatline_plugin_helper->setUp('Neatline');

        // Get table managers.
        $this->_exhibitsTable = $this->db->getTable('NeatlineExhibit');
        $this->_layersTable = $this->db->getTable('NeatlineLayer');
        $this->_exhibitsTable = $this->db->getTable('NeatlineExhibit');
        $this->_recordsTable = $this->db->getTable('NeatlineRecord');

    }

    /**
     * Install Neatline.
     *
     * @return void.
     */
    public function _addNeatlinePluginHooksAndFilters($plugin_broker, $plugin_name)
    {
        $plugin_broker->setCurrentPluginDirName($plugin_name);
        $neatline = new NeatlinePlugin;
        $neatline->setUp();
    }


    /**
     * Testing helpers.
     */


    /**
     * Create a Neatline exhibit.
     *
     * @return Omeka_record $neatline The exhibit.
     */
    public function _createNeatline(
        $name = 'Test Exhibit',
        $description = 'Test description.',
        $slug = 'test-exhibit',
        $public = 1,
        $is_map = 1,
        $is_timeline = 1,
        $is_undated_items = 1,
        $is_context_band = 1
    )
    {

        $neatline = new NeatlineExhibit();
        $neatline->title = $name;
        $neatline->description = $description;
        $neatline->slug = $slug;
        $neatline->public = $public;
        $neatline->is_map = $is_map;
        $neatline->is_timeline = $is_timeline;
        $neatline->is_items = $is_undated_items;
        $neatline->is_context_band = $is_context_band;
        $neatline->save();

        return $neatline;

    }

    /**
     * Create an Item.
     *
     * @return Omeka_record $item The item.
     */
    public function _createItem()
    {

        $item = new Item;
        $item->save();

        return $item;

    }

    /**
     * Create a data record.
     *
     * @return Omeka_record $item The record.
     */
    public function _createRecord()
    {

        $item = $this->_createItem();
        $neatline = $this->_createNeatline();
        $record = new NeatlineRecord($item, $neatline);
        $record->save();

        return $record;

    }

    /**
     * Create an element text for an item.
     *
     * @param Omeka_record $item The item.
     * @param string $elementSet The element set.
     * @param string $elementName The element name.
     * @param string $value The value for the text.
     *
     * @return Omeka_record $text The new text.
     */
    public function _createElementText($item, $elementSet, $elementName, $value)
    {

        // Get tables.
        $_db = get_db();
        $elementTable = $_db->getTable('Element');
        $elementTextTable = $_db->getTable('ElementText');

        // Fetch element record and the item type id.
        $element = $elementTable->findByElementSetNameAndElementName($elementSet, $elementName);

        $text = new ElementText;
        $text->record_id = $item->id;
        $text->record_type = 'Item';
        $text->element_id = $element->id;
        $text->text = $value;
        $text->save();

        return $text;

    }

}

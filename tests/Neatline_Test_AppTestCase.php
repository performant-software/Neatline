<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

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

        // Install the plugin.
        $pluginHelper = new Omeka_Test_Helper_Plugin;
        $pluginHelper->setUp('Neatline');

        // Get plugin tables.
        $this->_exhibitsTable = $this->db->getTable('NeatlineExhibit');
        $this->_layersTable = $this->db->getTable('NeatlineLayer');
        $this->_exhibitsTable = $this->db->getTable('NeatlineExhibit');
        $this->_recordsTable = $this->db->getTable('NeatlineRecord');

    }


    /**
     * Testing helpers.
     */


    /**
     * Create a Neatline exhibit.
     *
     * @param string $slug The exhibit slug.
     *
     * @return Omeka_record $neatline The exhibit.
     */
    public function __exhibit($slug='test-slug')
    {
        $exhibit = new NeatlineExhibit;
        $exhibit->slug = $slug;
        $exhibit->save();
        return $exhibit;
    }

    /**
     * Create an Item.
     *
     * @return Omeka_record $item The item.
     */
    public function __item()
    {
        $item = new Item;
        $item->save();
        return $item;
    }

    /**
     * Create a data record.
     *
     * @param Item $item The parent item.
     * @param NeatlineExhibit $exhibit The parent exhibit.
     *
     * @return NeatlineRecord $record The record.
     */
    public function __record($item=null, $exhibit=null)
    {

        // Create item.
        if (is_null($item)) $item = $this->__item();

        // Create exhibit.
        if (is_null($exhibit)) $exhibit = $this->__exhibit();

        $record = new NeatlineRecord($item, $exhibit);
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
    public function __text($item, $elementSet, $elementName, $value)
    {

        // Get element table.
        $elementTable = $this->db->getTable('Element');

        // Fetch element record and the item type id.
        $element = $elementTable->findByElementSetNameAndElementName(
            $elementSet, $elementName);

        $text = new ElementText;
        $text->record_id = $item->id;
        $text->record_type = 'Item';
        $text->element_id = $element->id;
        $text->text = $value;
        $text->save();

        return $text;

    }

    /**
     * Get the first exhibit.
     *
     * @return NeatlineExhibit The record.
     */
    public function getFirstExhibit()
    {
        $exhibits = $this->_exhibitsTable->fetchObjects(
            $this->_exhibitsTable->getSelect());
        return $exhibits[0];
    }

    /**
     * Get the last item record.
     *
     * @return Item The record.
     */
    public function getLastRecord()
    {
        $records = $this->_recordsTable->fetchObjects(
            $this->_recordsTable->getSelect());
        return end($records);
    }

}

<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Test suite parent class.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Test_AppTestCase extends Omeka_Test_AppTestCase
{


    /**
     * Bootstrap the plugin.
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
        $this->_recordsTable  = $this->db->getTable('NeatlineRecord');

        // Mock layers.
        Zend_Registry::set(
          'layers', NL_DIR . '/tests/phpunit/mocks/layers.json'
        );

    }


    /**
     * Clear the database.
     */
    public function tearDown()
    {
        $p = $this->db->prefix;
        $this->db->query("DELETE FROM `{$p}neatline_records` WHERE 1=1");
        $this->db->query("DELETE FROM `{$p}neatline_exhibits` WHERE 1=1");
        parent::tearDown();
    }


    /**
     * Create a Neatline exhibit.
     *
     * @param string $slug The exhibit slug.
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
     * @param NeatlineExhibit $exhibit The parent exhibit.
     * @param Item $item The parent item.
     * @return NeatlineRecord $record The record.
     */
    public function __record($exhibit=null, $item=null)
    {

        // Get exhibit and item.
        if (is_null($exhibit)) $exhibit = $this->__exhibit();
        if (is_null($item)) $item = $this->__item();

        // Create record.
        $record = new NeatlineRecord($exhibit, $item);
        $record->save();
        return $record;

    }


    /**
     * Write the response body from a route to a fixture file.
     *
     * @param string $route The resource location.
     * @param string $file The name of the fixture file.
     */
    public function writeFixture($route, $file)
    {

        // Open the fixture file.
        $path = NL_DIR.'/views/shared/javascripts/jasmine/fixtures/';
        $fixture = fopen($path . $file, 'w');

        // Hit route, get response.
        $this->dispatch($route);
        $response = $this->getResponse()->getBody('default');

        // Write fixture.
        fwrite($fixture, $response);
        fclose($fixture);

    }


    /**
     * Mock out PUT data before a request.
     *
     * @param array $data Key-value pairs.
     */
    public function writePut($data)
    {

        // Open the file.
        $mockPath = NL_DIR . '/tests/phpunit/mocks/put.txt';
        $fileIn = fopen($mockPath, 'w');

        // Write data.
        fwrite($fileIn, json_encode($data));
        fclose($fileIn);

        // Set global fileIn.
        Zend_Registry::set('fileIn', $mockPath);
        $this->request->setMethod('PUT');

    }


    /**
     * Get the body of the last response as an array.
     *
     * @return array The response data.
     */
    public function getResponseArray()
    {
        return json_decode($this->getResponse()->getBody('default'));
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
     * Get the last record.
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

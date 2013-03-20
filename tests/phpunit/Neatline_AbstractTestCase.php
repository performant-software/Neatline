<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Abstract test case.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_AbstractTestCase extends Omeka_Test_AppTestCase
{


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
     * Create an Item.
     *
     * @param string $title The exhibit title.
     * @return Omeka_record $item The item.
     */
    public function __item($title='test-title')
    {
        return $item = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => $title, 'html' => false)
                )
            )
        ));
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
        // if (is_null($item)) $item = $this->__item();

        // Create record.
        $record = new NeatlineRecord($exhibit, $item);
        $record->save();
        return $record;

    }


    /**
     * Write a fixture file.
     *
     * @param string $body The fixture body.
     * @param string $file The name of the fixture file.
     */
    public function writeFixture($body, $file)
    {

        // Open the fixture file.
        $path = NL_DIR . '/tests/jasmine/fixtures/';
        $fixture = fopen($path . $file, 'w');

        // Write fixture.
        fwrite($fixture, $body);
        fclose($fixture);

    }


    /**
     * Write the response body from a route to a fixture file.
     *
     * @param string $route The resource location.
     * @param string $file The name of the fixture file.
     */
    public function writeFixtureFromRoute($route, $file)
    {
        $this->dispatch($route);
        $response = $this->getResponse()->getBody('default');
        $this->writeFixture($response, $file);
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
     * Reload a record.
     *
     * @param Omeka_Record_AbstractRecord $record A record to reload.
     * @return Omeka_Record_AbstractRecord The reloaded record.
     */
    public function reload($record)
    {
        return $record->getTable()->find($record->id);
    }


    /**
     * Get the last record in a table.
     *
     * @param Omeka_Db_Table $table A table.
     * @return Neatline_AbstractRecord The last record.
     */
    public function getLastRow($table)
    {
        return end($table->fetchObjects($table->getSelect()));
    }


}

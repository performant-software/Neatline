<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Fixture extends Neatline_Case_Abstract
{


    protected $_isAdminTest = false;
    const FIXTURES_PATH = '/tests/jasmine/fixtures/';


    /**
     * Create a mock exhibit.
     */
    public function setUp()
    {

        parent::setUp();

        // Create a mock exhibit.
        $this->exhibit = $this->_exhibit();

    }


    /**
     * Write a fixture file.
     *
     * @param string $body The fixture body.
     * @param string $file The name of the fixture file.
     */
    protected function _writeFixture($body, $file)
    {

        // Open the fixture file.
        $fixture = fopen(NL_DIR . static::FIXTURES_PATH . $file, 'w');

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
    protected function _writeFixtureFromRoute($route, $file)
    {

        // Request the route.
        $this->resetResponse();
        $this->dispatch($route);

        // Write the fixture.
        $response = $this->_getResponseBody();
        $this->_writeFixture($response, $file);

    }


    /**
     * Write a record API fixture.
     *
     * @param NeatlineRecord $record The record to load.
     * @param string $file The name of the fixture file.
     */
    public function _writeRecordApiFixture($record, $file)
    {
        $this->resetRequest();
        $this->_writeFixtureFromRoute('neatline/records/'.$record->id, $file);
    }


    /**
     * Write a records API fixture.
     *
     * @param NeatlineExhibit $exhibit The exhibit to query.
     * @param string $file The name of the fixture file.
     */
    public function _writeRecordsApiFixture($exhibit, $file)
    {
        $this->request->setQuery('exhibit_id', $exhibit->id);
        $this->_writeFixtureFromRoute('neatline/records', $file);
    }


    /**
     * Render an exhibit HTML fixture.
     *
     * @param NeatlineExhibit $exhibit The current exhibit.
     * @param string $file The name of the fixture file.
     */
    protected function _writeExhibitMarkupFixture($exhibit, $file)
    {
        get_view()->neatline_exhibit = $exhibit;
        $html = get_view()->partial('exhibits/partials/exhibit.php');
        $this->_writeFixture($html, $file);
    }


    /**
     * Render an editor HTML fixture.
     *
     * @param NeatlineExhibit $exhibit The current exhibit.
     * @param string $file The name of the fixture file.
     */
    protected function _writeEditorMarkupFixture($exhibit, $file)
    {
        get_view()->neatline_exhibit = $exhibit;
        $html = get_view()->partial('exhibits/partials/editor_core.php');
        $this->_writeFixture($html, $file);
    }


}

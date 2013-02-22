<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generators for public-facing markup.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_PublicHtmlFixtureTest extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * Inject the real `layers.json`.
     */
    public function setUp()
    {
        parent::setUp();
        Zend_Registry::set('layers', NL_DIR . '/layers.json');
    }


    /**
     * `neatline-partial.html`
     */
    public function testNeatlinePartial()
    {
        $this->writeFixture('neatline/fixtures/neatline',
            'neatline-partial.html');
    }


    /**
     * `editor-partial.html`
     */
    public function testEditorPartial()
    {
        $this->writeFixture('neatline/fixtures/editor',
            'editor-partial.html');
    }


}

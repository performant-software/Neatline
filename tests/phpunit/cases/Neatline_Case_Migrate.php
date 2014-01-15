<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Migrate extends Neatline_Case_Default
{


    static protected $oldVersion = '2.0.2';
    static protected $newVersion = '2.2.0';


    /**
     * Install the old schema.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_installSchema(self::$oldVersion);
    }


    /**
     * Restore the current schema.
     */
    public function tearDown()
    {
        $this->_installSchema(self::$newVersion);
        parent::tearDown();
    }


    /**
     * Migration from the old version.
     */
    protected function _upgrade()
    {
        $this->helper->pluginBroker->callHook(
            'upgrade', array('old_version' => self::$oldVersion), 'Neatline'
        );
    }


    /**
     * Load a SQL fixture.
     *
     * @param string $fixture The name of the fixture.
     */
    protected function _loadFixture($fixture)
    {
        $this->db->query(file_get_contents(
            NL_TEST_DIR."/tests/migration/fixtures/$fixture.sql"
        ));
    }


}

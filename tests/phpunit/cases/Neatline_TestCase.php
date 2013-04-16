<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Neatline test case.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_TestCase extends Neatline_AbstractTestCase
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
        $this->__exhibits = $this->db->getTable('NeatlineExhibit');
        $this->__records  = $this->db->getTable('NeatlineRecord');

        // Register widget and presenter mocks.
        add_filter('neatline_exhibit_widgets', '_nl_mockWidgets');
        add_filter('neatline_record_widgets', '_nl_mockWidgets');
        add_filter('neatline_presenters', '_nl_mockPresenters');

        // Register layers.
        Zend_Registry::set('layers',
            NL_DIR . '/tests/phpunit/mocks/layers.json'
        );

        // Register script paths.
        get_view()->setScriptPath(VIEW_SCRIPTS_DIR);
        get_view()->addScriptPath(NL_DIR . '/views/shared');

    }


    /**
     * Get the Jasmine fixtures directory.
     *
     * @return string The directory.
     */
    protected function getFixturesPath()
    {
        return NL_DIR . '/tests/jasmine/fixtures/';
    }


}

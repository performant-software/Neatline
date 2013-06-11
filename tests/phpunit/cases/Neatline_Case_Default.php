<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Default extends Neatline_Case_Abstract
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
        $helper = new Omeka_Test_Helper_Plugin;
        $helper->setUp('Neatline');

        // Install sub-plugins.
        if (file_exists(NL_TEST_DIR . '/plugins.ini')) {
            $config = new Zend_Config_Ini(NL_TEST_DIR . '/plugins.ini');
            foreach ($config->plugins as $plugin) $helper->setUp($plugin);
        }

        // Get plugin tables.
        $this->__exhibits = $this->db->getTable('NeatlineExhibit');
        $this->__records  = $this->db->getTable('NeatlineRecord');

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

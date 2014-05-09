<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Fixture extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    /**
     * Create a mock exhibit.
     */
    public function setUp()
    {

        parent::setUp();

        // Create a default exhibit.
        $this->exhibit = $this->_exhibit();

    }


}

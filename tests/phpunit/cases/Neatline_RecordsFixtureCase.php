<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Abstract cast for record collection fixture generation.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_RecordsFixtureCase extends Neatline_TestCase
{


    protected $_isAdminTest = false;


    /**
     * Create exhibit, set `exhibit_id` GET parameter.
     */
    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->__exhibit();
        $this->request->setQuery(array(
          'exhibit_id' => $this->exhibit->id
        ));
    }


}

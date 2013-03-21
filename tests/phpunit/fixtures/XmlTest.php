<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * XML fixture generators.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_Xml extends Neatline_TestCase
{


    protected $_isAdminTest = false;


    /**
     * Omeka item search.
     * `items.xml`
     */
    public function testItemsXml()
    {
        $this->__item('Item 1');
        $this->__item('Item 2');
        $this->__item('Item 3');
        $this->request->setQuery(array('output' => 'omeka-xml'));
        $this->writeFixtureFromRoute('items/browse', 'items.xml');
    }


}

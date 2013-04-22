<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_RecordFormText extends Neatline_FixtureCase
{


    /**
     * `RecordFormText.items.xml`
     */
    public function testItems()
    {

        $item1 = $this->__item('Item 1');
        $item2 = $this->__item('Item 2');
        $item3 = $this->__item('Item 3');

        $item1->added = '2021-01-01';
        $item2->added = '2022-01-01';
        $item3->added = '2023-01-01';

        $item1->save();
        $item2->save();
        $item3->save();

        $this->request->setQuery(array('output' => 'omeka-xml'));

        $this->writeFixtureFromRoute('items/browse',
            'RecordFormText.items.xml'
        );

    }


}

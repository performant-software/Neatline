<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessPresenter extends Neatline_Case_Migrate200
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessPresenter.records.json');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If `show_bubble` on the old record is true, the `presenter` field
     * on the new record should be set to `StaticBubble`.
     */
    public function testBubble()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('Bubble')->presenter,
            'StaticBubble'
        );
    }


    /**
     * If `show_bubble` on the old record is false, the `presenter` field
     * on the new record should be set to `None`.
     */
    public function testNoBubble()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('No Bubble')->presenter,
            'None'
        );
    }


}

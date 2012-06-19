<?php
/**
 * Tests the get_current_neatline() helper.
 */
class GetCurrentNeatlineTest extends Omeka_Test_AppTestCase
{

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

    public function testGetCurrentNeatline()
    {
        $this->helper->_createNeatline();
        $this->dispatch('neatline-exhibits/show/test-exhibit');
        $neatline = get_current_neatline();
        $this->assertEquals('1', $neatline->id);
    }
}

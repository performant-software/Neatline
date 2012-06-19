<?php
/**
 * Tests for neatline function
 */
class NeatlineTest extends Omeka_Test_AppTestCase
{
    protected $_isAdminTest = false;

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

    /**
     * Tests whether neatline() returns the correct value.
     *
     * @uses neatline()
     **/
    public function testNeatlineValue() 
    {

        $neatline = $this->helper->_createNeatline();

        $this->dispatch('neatline-exhibits/show/test-exhibit');

        // Neatline Name
        $this->assertEquals('Test Exhibit', neatline('name'));
        $this->assertEquals('Test Exhibit', neatline('Name'));

        // Neatline Description
        $this->assertEquals('Test description.', neatline('description'));
        $this->assertEquals('Test description.', neatline('Description'));

        // Neatline ID
        $this->assertEquals('1', neatline('id'));
        $this->assertEquals('1', neatline('ID'));

        $this->assertEquals('test-exhibit', neatline('slug'));
        $this->assertEquals('test-exhibit', neatline('Slug'));

    }
}

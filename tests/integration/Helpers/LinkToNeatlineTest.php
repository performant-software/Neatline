<?php
/**
 * Tests for link_to_neatline function
 */
class LinkToNeatlineTest extends Omeka_Test_AppTestCase
{
    protected $_isAdminTest = false;

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

    /**
     * Tests whether link_to_neatline() returns the correct link for a neatline.
     *
     * @uses link_to_neatline()
     */
    public function testLinkToNeatline()
    {

        $neatline = $this->helper->_createNeatline();

        $this->dispatch('neatline-exhibits/show/test-exhibit');

        $linkDefault = link_to_neatline();
        $this->assertSame($linkDefault, '<a href="/neatline-exhibits/show/test-exhibit">Test Exhibit</a>');

        $linkWithNewText = link_to_neatline('New Text');
        $this->assertSame($linkWithNewText, '<a href="/neatline-exhibits/show/test-exhibit">New Text</a>');

        $linkToEditWithProps = link_to_neatline(null, array('class' => 'edit'), 'edit');
        $this->assertSame($linkToEditWithProps, '<a class="edit" href="/neatline-exhibits/edit/1">Test Exhibit</a>');

    }
}

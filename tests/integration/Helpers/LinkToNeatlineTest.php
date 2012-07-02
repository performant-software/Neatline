<?php
/**
 * Tests for link_to_neatline function
 */
class LinkToNeatlineTest extends Neatline_Test_AppTestCase
{

    protected $_isAdminTest = false;

    /**
     * Tests whether link_to_neatline() returns the correct link for a neatline.
     *
     * @uses link_to_neatline()
     */
    public function testLinkToNeatline()
    {

        // $neatline = $this->_createNeatline();

        // $this->dispatch('neatline-exhibits/show/test-exhibit');

        // $linkDefault = link_to_neatline();
        // $this->assertSame($linkDefault, '<a href="' . WEB_DIR . '/neatline-exhibits/show/test-exhibit">Test Exhibit</a>');

        // $linkWithNewText = link_to_neatline('New Text');
        // $this->assertSame($linkWithNewText, '<a href="' . WEB_DIR . '/neatline-exhibits/show/test-exhibit">New Text</a>');

        // $linkToEditWithProps = link_to_neatline(null, array('class' => 'edit'), 'edit');
        // $this->assertSame($linkToEditWithProps, '<a class="edit" href="' . WEB_DIR . '/neatline-exhibits/edit/1">Test Exhibit</a>');

    }

}

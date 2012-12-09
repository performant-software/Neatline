<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for browse action in index controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_IndexControllerTest_Browse
    extends Neatline_Test_AppTestCase
{


    /**
     * Index should redirect to the browse action.
     */
    public function testIndexRedirect()
    {
        $this->dispatch('neatline');
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('browse');
    }


    /**
     * Check for base markup in the browse view.
     */
    public function testBrowseBaseMarkup()
    {
        $this->dispatch('neatline');
        $this->assertQueryContentContains('a.add', 'Create an Exhibit');
    }


    /**
     * When there are no exhibits, the browse view should display a link
     * to create an exhibit.
     */
    public function testBrowseWithNoExhibits()
    {
        $this->dispatch('neatline');
        $this->assertQueryContentContains('p.neatline-alert',
            'There are no Neatline exhibits yet.');
        $this->assertQueryContentContains('a', 'Create one!');
    }


    /**
     * Pagination should be displayed when there are too many the exhibits
     * to fit on one page.
     */
    public function testBrowsePagination()
    {

        // Create 5 exhibits.
        for ($i = 0; $i < 5; $i++) $this->__exhibit('slug'.$i);

        // Set the paging limit.
        set_option('per_page_admin', 2);

        // Hit index.
        $this->dispatch('neatline');

        // Check for paging.
        $neatlinesInView = get_view()->neatline_exhibits;
        $this->assertEquals(count($neatlinesInView), 2);
        $this->assertQuery('div.pagination');

    }


}

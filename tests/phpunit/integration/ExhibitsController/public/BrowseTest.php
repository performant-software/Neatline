<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_PublicBrowse extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    /**
     * BROWSE should display a list of exhibits with links to the public show
     * views and editor views.
     */
    public function testExhibitList()
    {

        $exhibit1 = $this->_exhibit('slug1');
        $exhibit2 = $this->_exhibit('slug2');
        $exhibit3 = $this->_exhibit('slug3');
        $exhibit1->title = "Exhibit 1";
        $exhibit2->title = "Exhibit 2";
        $exhibit3->title = "Exhibit 3";
        $exhibit1->added = '2001-01-01';
        $exhibit2->added = '2002-01-01';
        $exhibit3->added = '2003-01-01';

        $exhibit1->save();
        $exhibit2->save();
        $exhibit3->save();

        $this->dispatch('neatline');

        // Should list 3 exhibits.
        $this->assertXpath('//a[@class="neatline"]', 3);

        // Should link to exhibits.
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug1').'"]');
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug2').'"]');
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug3').'"]');

    }


    /**
     * When the number of exhibits exceed the page length, the maximum number
     * of exhibits should be listed and pagination links should be displayed.
     */
    public function testPagination()
    {

        // Set public page length to 2.
        set_option('per_page_public', 2);
        set_option('per_page_admin', 10);

        $exhibit1 = $this->_exhibit('slug1');
        $exhibit2 = $this->_exhibit('slug2');
        $exhibit3 = $this->_exhibit('slug3');
        $exhibit4 = $this->_exhibit('slug4');
        $exhibit1->added = '2001-01-01';
        $exhibit2->added = '2002-01-01';
        $exhibit3->added = '2003-01-01';
        $exhibit4->added = '2004-01-01';

        $exhibit1->save();
        $exhibit2->save();
        $exhibit3->save();
        $exhibit4->save();

        // Page 1.
        $this->dispatch('neatline');

        // Should list first two exhibits.
        $this->assertXpath('//a[@class="neatline"]', 2);
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug4').'"]');
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug3').'"]');

        // Should show pagination.
        $this->assertXpath('//div[@class="pagination"]');

        // Page 2.
        $this->resetResponse();
        $this->dispatch('neatline?page=2');

        // Should show next two exhibits.
        $this->assertXpath('//a[@class="neatline"]', 2);
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug2').'"]');
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug1').'"]');

    }


}

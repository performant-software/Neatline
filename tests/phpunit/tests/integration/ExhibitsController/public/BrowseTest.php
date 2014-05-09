<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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

        set_option('per_page_public', 2);

        $exhibit1 = $this->_exhibit('slug1');
        $exhibit2 = $this->_exhibit('slug2');
        $exhibit3 = $this->_exhibit('slug3');
        $exhibit4 = $this->_exhibit('slug4');
        $exhibit5 = $this->_exhibit('slug5');
        $exhibit6 = $this->_exhibit('slug6');

        $url1 = public_url('neatline/show/slug1');
        $url2 = public_url('neatline/show/slug2');
        $url3 = public_url('neatline/show/slug3');
        $url4 = public_url('neatline/show/slug4');
        $url5 = public_url('neatline/show/slug5');
        $url6 = public_url('neatline/show/slug6');

        $exhibit1->added = '2006-01-01';
        $exhibit2->added = '2005-01-01';
        $exhibit3->added = '2004-01-01';
        $exhibit4->added = '2003-01-01';
        $exhibit5->added = '2002-01-01';
        $exhibit6->added = '2001-01-01';

        $exhibit1->save();
        $exhibit2->save();
        $exhibit3->save();
        $exhibit4->save();
        $exhibit5->save();
        $exhibit6->save();

        // --------------------------------------------------------------------

        // Page 1.
        $this->dispatch('neatline');

        // Should just list exhibits 1-2.
        $this->assertXpath('//a[@href="'.$url1.'"]');
        $this->assertXpath('//a[@href="'.$url2.'"]');
        $this->assertNotXpath('//a[@href="'.$url3.'"]');
        $this->assertNotXpath('//a[@href="'.$url4.'"]');
        $this->assertNotXpath('//a[@href="'.$url5.'"]');
        $this->assertNotXpath('//a[@href="'.$url6.'"]');

        // Should link to page 2.
        $this->assertXpath('//a[@href="'.url('neatline?page=2').'"]');

        $this->resetResponse();
        $this->resetRequest();

        // --------------------------------------------------------------------

        // Page 2.
        $this->dispatch('neatline?page=2');

        // Should just list exhibits 3-4.
        $this->assertNotXpath('//a[@href="'.$url1.'"]');
        $this->assertNotXpath('//a[@href="'.$url2.'"]');
        $this->assertXpath('//a[@href="'.$url3.'"]');
        $this->assertXpath('//a[@href="'.$url4.'"]');
        $this->assertNotXpath('//a[@href="'.$url5.'"]');
        $this->assertNotXpath('//a[@href="'.$url6.'"]');

        // Should link to page 3.
        $this->assertXpath('//a[@href="'.url('neatline?page=3').'"]');

        $this->resetResponse();
        $this->resetRequest();

        // --------------------------------------------------------------------

        // Page 3.
        $this->dispatch('neatline?page=3');

        // Should just list exhibits 5-6.
        $this->assertNotXpath('//a[@href="'.$url1.'"]');
        $this->assertNotXpath('//a[@href="'.$url2.'"]');
        $this->assertNotXpath('//a[@href="'.$url3.'"]');
        $this->assertNotXpath('//a[@href="'.$url4.'"]');
        $this->assertXpath('//a[@href="'.$url5.'"]');
        $this->assertXpath('//a[@href="'.$url6.'"]');

        // Should link back to page 2.
        $this->assertXpath('//a[@href="'.url('neatline?page=2').'"]');

        // --------------------------------------------------------------------

    }


}

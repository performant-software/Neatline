<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_PublicMapRefreshingWms extends Neatline_FixtureCase
{


    /**
     * `PublicMapRefreshingWms.original.json`
     * `PublicMapRefreshingWms.changed.json`
     */
    public function testWms()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);

        $record1->title         = 'title1';
        $record2->title         = 'title2';
        $record3->title         = 'title3';
        $record1->wms_address   = 'address1';
        $record2->wms_address   = 'address2';
        $record3->wms_address   = 'address3';
        $record1->wms_layers    = 'layers1';
        $record2->wms_layers    = 'layers2';
        $record3->wms_layers    = 'layers3';
        $record1->added         = '2003-01-01';
        $record2->added         = '2002-01-01';
        $record3->added         = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'PublicMapRefreshingWms.original.json'
        );

        $record1->wms_address   = 'address4';
        $record2->wms_address   = 'address5';
        $record3->wms_address   = 'address6';
        $record1->wms_layers    = 'layers4';
        $record2->wms_layers    = 'layers5';
        $record3->wms_layers    = 'layers6';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'PublicMapRefreshingWms.changed.json'
        );

    }


}

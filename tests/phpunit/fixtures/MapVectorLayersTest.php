<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Map Vector Layers" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_MapVectorLayers extends Neatline_FixtureCase
{


    /**
     * `MapVectorLayers.records.regular.json`
     * `MapVectorLayers.records.deleted.json`
     */
    public function testLayerManagement()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record3->title     = 'title3';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';
        $record3->coverage  = 'POINT(5 6)';
        $record1->added     = '2003-01-01';
        $record2->added     = '2002-01-01';
        $record3->added     = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'MapVectorLayers.records.regular.json'
        );

        $record3->delete();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'MapVectorLayers.records.deleted.json'
        );

    }


    /**
     * `MapVectorLayers.records.styles.json`
     */
    public function testStyles()
    {

        $record = $this->__record($this->exhibit);

        $record->setArray(array(
            'coverage'          => 'POINT(1 2)',
            'fill_color'        => '1',
            'select_color'      => '2',
            'stroke_color'      => '3',
            'fill_opacity'      => 4,
            'select_opacity'    => 5,
            'stroke_opacity'    => 6,
            'stroke_width'      => 7,
            'point_radius'      => 8,
            'point_image'       => '9'
        ));

        $record->save();

        $this->writeFixtureFromRoute('neatline/records',
            'MapVectorLayers.records.styles.json'
        );

    }


}

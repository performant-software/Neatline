<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_PublicMapVectorStyles extends Neatline_FixtureCase
{


    /**
     * `PublicMapVectorStyles.records.json`
     */
    public function testRecords()
    {

        $record = $this->__record($this->exhibit);

        $record->setArray(array(
            'coverage'              => 'POINT(1 2)',
            'fill_color'            => '1',
            'fill_color_select'     => '2',
            'stroke_color'          => '3',
            'stroke_color_select'   => '4',
            'fill_opacity'          => 0.5,
            'fill_opacity_select'   => 0.6,
            'stroke_opacity'        => 0.7,
            'stroke_opacity_select' => 0.8,
            'stroke_width'          => 9,
            'point_radius'          => 10,
            'point_image'           => '11'
        ));

        $record->save();

        $this->writeFixtureFromRoute('neatline/records',
            'PublicMapVectorStyles.records.json'
        );

    }


}

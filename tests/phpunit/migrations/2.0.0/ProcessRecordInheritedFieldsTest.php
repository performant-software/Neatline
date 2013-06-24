<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessRecordInheritedFields
    extends Neatline_Case_Migrate200
{


    public function setUp()
    {

        parent::setUp();

        $this->_loadFixture('ProcessRecordInheritedFields.exhibits');
        $this->_loadFixture('ProcessRecordInheritedFields.records');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * When local values are defined for inherited fields, migrate the
     * values directly to the new record.
     */
    public function testUseLocalValuesWhenPresent()
    {

        // STYLES
        $record = $this->_getRecordByTitle('Parent Record');
        $this->_assertFlattenedStyles($record);

        // VISIBILITY
        $this->assertEquals($record->after_date,    '2000');
        $this->assertEquals($record->before_date,   '2010');

    }


    /**
     * When a local value is not present, the record has a parent, and the
     * parent has a concrete value, migrate the value from the parent.
     */
    public function testFlattenParentInheritance()
    {

        // STYLES
        $record = $this->_getRecordByTitle('Child Record');
        $this->_assertFlattenedStyles($record);

        // VISIBILITY
        $this->assertEquals($record->after_date,    '2000');
        $this->assertEquals($record->before_date,   '2010');

    }


    /**
     * When a local value is not present and the record does not have a
     * parent, values should be pulled from the exhibit defaults.
     */
    public function testFlattenExhibitInheritance()
    {
        $this->_assertFlattenedStyles(
            $this->_getRecordByTitle('Exhibit Inheritance')
        );
    }


    /**
     * Assert the flattened values.
     *
     * @param NeatlineRecord $record
     */
    protected function _assertFlattenedStyles($record)
    {

        // COLORS
        $this->assertEquals($record->fill_color,            '#111111');
        $this->assertEquals($record->fill_color_select,     '#333333');
        $this->assertEquals($record->stroke_color,          '#222222');
        $this->assertEquals($record->stroke_color_select,   '#333333');

        // OPACITIES
        $this->assertEquals($record->fill_opacity,          0.04);
        $this->assertEquals($record->fill_opacity_select,   0.05);
        $this->assertEquals($record->stroke_opacity,        0.06);
        $this->assertEquals($record->stroke_opacity_select, 0.05);

        // DIMENSIONS
        $this->assertEquals($record->stroke_width,          8);
        $this->assertEquals($record->point_radius,          9);

    }


    /**
     * When no exhibit default exists, values should be pulled from the
     * global values in the site options.
     */
    public function testFlattenGlobalInheritance()
    {

        $record = $this->_getRecordByTitle('Global Inheritance');

        // COLORS
        $this->assertEquals(
            $record->fill_color,
            get_option('vector_color')
        );
        $this->assertEquals(
            $record->fill_color_select,
            get_option('highlight_color')
        );
        $this->assertEquals(
            $record->stroke_color,
            get_option('stroke_color')
        );
        $this->assertEquals(
            $record->stroke_color_select,
            get_option('highlight_color')
        );

        // OPACITIES
        $this->assertEquals(
            $record->fill_opacity,
            get_option('vector_opacity') / 100
        );
        $this->assertEquals(
            $record->fill_opacity_select,
            get_option('select_opacity') / 100
        );
        $this->assertEquals(
            $record->stroke_opacity,
            get_option('stroke_opacity') / 100
        );
        $this->assertEquals(
            $record->stroke_opacity_select,
            get_option('select_opacity') / 100
        );

        // DIMENSIONS
        $this->assertEquals(
            $record->stroke_width,
            get_option('stroke_width')
        );
        $this->assertEquals(
            $record->point_radius,
            get_option('point_radius')
        );

    }


}

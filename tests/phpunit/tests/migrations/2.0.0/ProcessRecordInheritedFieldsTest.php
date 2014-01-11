<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessRecordInheritedFields
    extends Neatline_Case_Migration_200
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
     * When local values are defined for inherited fields, migrate the values
     * directly to the new record.
     */
    public function testUseLocalValuesWhenPresent()
    {

        // STYLES
        $record = $this->_getRecordByTitle('Parent Record');
        $this->_assertFlattenedStyles($record);

        // VISIBILITY
        $this->assertEquals('2000', $record->after_date);
        $this->assertEquals('2010', $record->before_date);

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
        $this->assertEquals('2000', $record->after_date);
        $this->assertEquals('2010', $record->before_date);

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
        $this->assertEquals('#111111', $record->fill_color);
        $this->assertEquals('#333333', $record->fill_color_select);
        $this->assertEquals('#222222', $record->stroke_color);
        $this->assertEquals('#333333', $record->stroke_color_select);

        // OPACITIES
        $this->assertEquals(0.04, $record->fill_opacity);
        $this->assertEquals(0.05, $record->fill_opacity_select);
        $this->assertEquals(0.06, $record->stroke_opacity);
        $this->assertEquals(0.05, $record->stroke_opacity_select);

        // DIMENSIONS
        $this->assertEquals(8, $record->stroke_width);
        $this->assertEquals(9, $record->point_radius);

    }


    /**
     * When no exhibit default exists, values should be pulled from the global
     * values in the site options.
     */
    public function testFlattenGlobalInheritance()
    {

        $record = $this->_getRecordByTitle('Global Inheritance');

        // COLORS
        $this->assertEquals(
            get_option('vector_color'),
            $record->fill_color
        );
        $this->assertEquals(
            get_option('highlight_color'),
            $record->fill_color_select
        );
        $this->assertEquals(
            get_option('stroke_color'),
            $record->stroke_color
        );
        $this->assertEquals(
            get_option('highlight_color'),
            $record->stroke_color_select
        );

        // OPACITIES
        $this->assertEquals(
            get_option('vector_opacity') / 100,
            $record->fill_opacity
        );
        $this->assertEquals(
            get_option('select_opacity') / 100,
            $record->fill_opacity_select
        );
        $this->assertEquals(
            get_option('stroke_opacity') / 100,
            $record->stroke_opacity
        );
        $this->assertEquals(
            get_option('select_opacity') / 100,
            $record->stroke_opacity_select
        );

        // DIMENSIONS
        $this->assertEquals(
            get_option('stroke_width'),
            $record->stroke_width
        );
        $this->assertEquals(
            get_option('point_radius'),
            $record->point_radius
        );

    }


}

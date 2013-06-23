<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessInheritedFields
    extends Neatline_Case_Migrate200
{


    /**
     * When local values are defined for inherited styles, migrate the
     * values directly to the new record.
     */
    public function testUseLocalValuesWhenPresent()
    {

    }


    /**
     * When a local value is not present, the record has a parent, and the
     * parent has a concrete value, migrate the value from the parent.
     */
    public function testFlattenParentInheritance()
    {

    }


    /**
     * When a local value is not present and the record does not have a
     * parent, values should be pulled from the exhibit defaults.
     */
    public function testFlattenExhibitInheritance()
    {

    }


    /**
     * When no exhibit default exists, values should be pulled from the
     * global values in the site options.
     */
    public function testFlattenGlobalInheritance()
    {

    }


}

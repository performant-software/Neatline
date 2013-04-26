<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_CompileWms extends Neatline_TestCase
{


    /**
     * When a WMS address and layer are defined, `compileWms` should set
     * the ur-coverage that will always be matched by extent queries and
     * flip `is_coverage` to 1.
     */
    public function testWmsLayerDefined()
    {

    }


    /**
     * When a WMS address and layer are _not_ defined, `compileWms` should
     * not make any changes to the record.
     */
    public function testWmsLayerNotDefined()
    {

    }


}

<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_Coverage extends Neatline_Case_Default
{
    /**
     * `nl_explode` should split on ','.
     */
    public function testExtractValueWKT()
    {
        $this->assertNotNull(nl_extractWkt('POINT (13 42)'));
    }

    public function testIgnoreNonWKT()
    {
        $this->assertNull(nl_extractWkt('Paris'));
    }
}

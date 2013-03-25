<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `ItemImporter`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ItemImporterTest_Explode extends Neatline_TestCase
{


    /**
     * `ItemImporter` should create Neatline records for all Omeka items
     * that match the search query.
     */
    public function testCreateRecords()
    {
        // TODO
    }


    /**
     * For any given Omeka item, `ItemImporter` should check to see if a
     * Neatline record already exists in the exhibit for the item; if so,
     * the record should be re-saved/compiled, but not duplicated.
     */
    public function testBlockDuplicates()
    {
        // TODO
    }


}

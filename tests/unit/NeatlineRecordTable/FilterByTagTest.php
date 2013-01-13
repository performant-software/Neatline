<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_filterByTag()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_FilterByTag
    extends Neatline_Test_AppTestCase
{


    /**
     * _filterByTag() should match a single tag.
     */
    public function testSingleTag()
    {

        $record = $this->__recordWithTags('tag1');

        // Form select.
        $select = $this->_recordsTable->getSelect();
        $select = $this->_recordsTable->_filterByTag(
            $select, 'tag1'
        );

        // Record should match.
        $record = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(1, $record);

    }


    /**
     * _filterByTag() should match a space-delimited tag.
     */
    public function testSpaceDelimited()
    {

        $record = $this->__recordWithTags('tag1 tag2 tag3');

        // Form select.
        $select = $this->_recordsTable->getSelect();
        $select = $this->_recordsTable->_filterByTag(
            $select, 'tag2'
        );

        // Record should match.
        $record = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(1, $record);

    }


    /**
     * _filterByTag() should match a comma-delimited tag.
     */
    public function testCommaDelimited()
    {

        $record = $this->__recordWithTags('tag1, tag2, tag3');

        // Form select.
        $select = $this->_recordsTable->getSelect();
        $select = $this->_recordsTable->_filterByTag(
            $select, 'tag2'
        );

        // Record should match.
        $record = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(1, $record);

    }


    /**
     * _filterByTag() should match a tag at the beginning of the string.
     */
    public function testStartOfString()
    {

        $record = $this->__recordWithTags('tag1 tag2 tag3');

        // Form select.
        $select = $this->_recordsTable->getSelect();
        $select = $this->_recordsTable->_filterByTag(
            $select, 'tag1'
        );

        // Record should match.
        $record = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(1, $record);

    }


    /**
     * _filterByTag() should match a tag at the end of the string.
     */
    public function testEndOfString()
    {

        $record = $this->__recordWithTags('tag1 tag2 tag3');

        // Form select.
        $select = $this->_recordsTable->getSelect();
        $select = $this->_recordsTable->_filterByTag(
            $select, 'tag3'
        );

        // Record should match.
        $record = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(1, $record);

    }


    /**
     * _filterByTag() should not match a super-string of the tag.
     */
    public function testRejectSuperstring()
    {

        $record = $this->__recordWithTags('tag1');

        // Form select.
        $select = $this->_recordsTable->getSelect();
        $select = $this->_recordsTable->_filterByTag(
            $select, 'tag'
        );

        // Record should not match.
        $record = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(0, $record);

    }


    /**
     * _filterByTag() should match nothing when the tag is absent.
     */
    public function testNoMatch()
    {

        $record = $this->__recordWithTags('tag1');

        // Form select.
        $select = $this->_recordsTable->getSelect();
        $select = $this->_recordsTable->_filterByTag(
            $select, 'tag2'
        );

        // Record should not match.
        $record = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(0, $record);

    }


}

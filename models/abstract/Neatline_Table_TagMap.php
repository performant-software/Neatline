<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Table_TagMap extends Omeka_Db_Table
{


    /**
     * Get the associated tag table.
     *
     * @return Neatline_Table_Tag The tag table.
     */
    abstract public function getTagTable();


    /**
     * Delete all tag mappings for an object.
     *
     * @param Omeka_Record_AbstractRecord $object The tagged object.
     */
    public function deleteTaggings($object)
    {
        // TODO
    }


    /**
     * Insert an individual tagging for an object.
     *
     * @param Omeka_Record_AbstractRecord $object The tagged object.
     * @param Neatline_Row_Tag $tag A tag record.
     */
    public function createTagging($object, $tag)
    {
        // TODO
    }


    /**
     * Insert a collection of taggings for an object.
     *
     * @param Omeka_Record_AbstractRecord $object The tagged object.
     * @param array $names A array of tag names.
     */
    public function insertTaggings($object, $names)
    {

        // Delete existings taggings.
        $this->deleteTaggings($object);
        $tags = $this->getTagTable();

        // Insert new taggings.
        foreach ($names as $name) {
            $this->insertTagging($object, $tags->getOrCreate($name));
        }

    }


}

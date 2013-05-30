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
     * Insert a collection of taggings for an object.
     *
     * @param Omeka_Record_AbstractRecord $object The tagged object.
     * @param array $names A array of tag names.
     */
    public function insertTaggings($object, $names)
    {

        $tags = $this->getTagTable();

        // Delete existing taggings.
        $this->deleteTaggings($object);

        // Insert new taggings.
        foreach ($names as $name) {
            $this->createTagging($object, $tags->getOrCreateTag($name));
        }

    }


    /**
     * Delete all tag mappings for an object.
     *
     * @param Omeka_Record_AbstractRecord $object The tagged object.
     */
    public function deleteTaggings($object)
    {
        $this->delete($this->getTableName(), array(
            'object_id=?', $object->id
        ));
    }


    /**
     * Insert an individual tagging for an object.
     *
     * @param Omeka_Record_AbstractRecord $object The tagged object.
     * @param Neatline_Row_Tag $tag A tag record.
     * @return Neatline_Row_TagMap $tagging The new tagging.
     */
    public function createTagging($object, $tag)
    {
        $class = $this->_target;
        $tagging = new $class($object, $tag);
        $tagging->save();
        return $tagging;
    }


}

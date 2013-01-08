<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Table class for tags.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineTagTable extends Omeka_Db_Table
{


    /**
     * Find all tags in a collection.
     *
     * @param Omeka_Record $exhibit The exhibit.
     * @return array The collection of tag records.
     */
    public function findByExhibit($exhibit)
    {
        return $this->fetchObjects(
            $this->getSelect()
                ->where('exhibit_id = ?', $exhibit->id)
        );
    }


    /**
     * Find a tag by its name.
     *
     * @param Omeka_Record $exhibit The exhibit.
     * @param string $name The tag name.
     * @return Omeka_Record The tag record.
     */
    public function findByName($exhibit, $name)
    {
        return $this->fetchObject(
            $this->getSelect()
                ->where('exhibit_id = ?', $exhibit->id)
                ->where('tag = ?', $name)
        );
    }


    /**
     * Build an array representation of all tags in an exhibit.
     *
     * @param Omeka_Record $exhibit The exhibit.
     * @return array An array of tags arrays.
     */
    public function queryTags($exhibit)
    {
        $data = array();
        $tags = $this->findByExhibit($exhibit);
        foreach ($tags as $tag) $data[] = $tag->toArray();
        return $data;
    }


}

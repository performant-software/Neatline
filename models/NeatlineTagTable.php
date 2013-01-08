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
     * Find a tag by its name.
     *
     * @param string $name The tag name.
     * @return Omeka_Record $exhibit The parent exhibit.
     * @return Omeka_Record $tag The tag.
     */
    public function findByName($exhibit, $name)
    {
        return $this->fetchObject(
            $this->getSelect()
                ->where('exhibit_id = ?', $exhibit->id)
                ->where('tag = ?', $name)
        );
    }


}

<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Table_Tag extends Omeka_Db_Table
{


    /**
     * Get or create a tag by name.
     *
     * @param string $name A tag name.
     */
    public function getOrCreateTag($name)
    {
        $tag = $this->getTag($name);
        return $tag ? $tag : $this->createTag($name);
    }


    /**
     * Get a tag by name.
     *
     * @param string $name A tag name.
     * @return Neatline_Row_Tag The existing tag record.
     */
    public function getTag($name)
    {
        return $this->findBySql('name=?', array($name), true);
    }


    /**
     * Create a tag by name.
     *
     * @param string $name A tag name.
     * @return Neatline_Row_Tag The new tag record.
     */
    public function createTag($name)
    {
        $class = $this->_target;
        $tag = new $class($name);
        $tag->save();
        return $tag;
    }


}

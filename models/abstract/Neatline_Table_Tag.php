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
     * Get a tag by name.
     *
     * @param string $tag A tag.
     */
    public function getTag($tag)
    {
        return $this->findBySql('tag=?', array($tag), true);
    }


}

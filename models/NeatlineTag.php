<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for Neatline base layer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineTag extends Omeka_Record_AbstractRecord
{


    public $exhibit_id;         // INT(10) UNSIGNED NOT NULL
    public $tag;                // TINYTEXT COLLATE utf8_unicode_ci NULL


    /**
     * Set foreign keys.
     *
     * @param Omeka_record $exhibit The exhibit record.
     */
    public function __construct($exhibit = null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id = $exhibit->id;
    }


}

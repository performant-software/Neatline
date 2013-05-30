<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Row_Map extends Neatline_Row_Abstract
{


    public $object_id;  // INT(10) UNSIGNED NULL
    public $tag_id;     // INT(10) UNSIGNED NULL


    /**
     * Set object and tag references.
     *
     * @param Omeka_Record_AbstractRecord $object The tagged object.
     * @param Neatline_Row_Tag $tag A tag record.
     */
    public function __construct($object = null, $tag = null)
    {
        parent::__construct();
        if (!is_null($object)) $this->object_id = $object->id;
        if (!is_null($tag)) $this->tag_id = $tag->id;
    }


}

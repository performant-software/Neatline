<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_AbstractStyleset extends Neatline_AbstractRecord
{


    public $record_id; // INT(10) UNSIGNED NULL


    /**
     * Set parent record foreign key.
     *
     * @param NeatlineRecord $record The parent record.
     */
    public function __construct($record = null)
    {
        parent::__construct();
        if (!is_null($record)) $this->record_id = $exhibit->id;
    }


    /**
     * Set a field if the passed value is not whitespace.
     *
     * @param NeatlineRecord $record The parent record.
     */
    public function setByRecord($record)
    {
        $this->setFromArray($record->toArrayForSave());
    }


}

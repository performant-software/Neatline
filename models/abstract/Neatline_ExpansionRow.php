<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for record expansion.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_ExpansionRow extends Neatline_AbstractRow
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
        if (!is_null($record)) $this->record_id = $record->id;
    }


}

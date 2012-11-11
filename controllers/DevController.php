<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * TODO: Development controller to mock out exhibits, records, and tags.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_DevController extends Omeka_Controller_AbstractActionController
{

    /**
     * Get tables.
     *
     * @return void
     */
    public function init()
    {
        $this->exhibitsTable =  $this->_helper->db->getTable('NeatlineExhibit');
        $this->recordsTable =   $this->_helper->db->getTable('NeatlineRecord');
    }

    /**
     * Create exhibit with 1000 records and 10 tags.
     *
     * @return void.
     */
    public function insertAction()
    {

        // Create exhibit.
        $exhibit = new NeatlineExhibit();
        $exhibit->slug = 'dev';
        $exhibit->save();

        // Create records.
        for ($i=0; $i<1000; $i++) {
            $record = new NeatlineRecord(null, $exhibit);
            $record->save();
        }

    }

    /**
     * Clear tables.
     *
     * @return void.
     */
    public function truncateAction()
    {

    }

}

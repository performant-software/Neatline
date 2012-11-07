<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Prepares starting JSON output for the front-end application.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRenderer
{

    /**
     * Set the record.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     *
     * @return void.
     */
    public function __construct($exhibit)
    {
        $this->exhibit = $exhibit;
    }

    /**
     * Assemble parameters.
     *
     * @return array The parameter array.
     */
    public function render()
    {

        return array(

            // Exhibit id.
            'id' => $this->exhibit->id,

            // Data emitter.
            'dataSource' => neatline_getDataSource($this->exhibit)

        );

    }

}

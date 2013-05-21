<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_ImportItems extends Omeka_Job_AbstractJob
{


    /**
     * Import Omeka items.
     */
    public function perform()
    {

        // Since this code isn't running in the context of a regular web
        // request, the hierarchy of view template directories hasn't been
        // set up by the controller. In order for the item compilation to
        // work properly, we need to create new instance of `Omeka_View`,
        // set it in the registry, and manually register the directories
        // where the view should search for template files - first in the
        // theme, then in the Neatline plugin, then in the Omeka core.

        nl_mockView();

        // Manually set the base web directory passed from the controller
        // action. This ensures that links to file attachments will point
        // to the web-accessible locations, not to the local filesystem.

        nl_setWebDir($this->_options['web_dir']);

        $__records  = $this->_db->getTable('NeatlineRecord');
        $__exhibits = $this->_db->getTable('NeatlineExhibit');
        $__items    = $this->_db->getTable('Item');

        // Load the exhibit, alias the query.
        $exhibit = $__exhibits->find($this->_options['exhibit_id']);
        $query = $this->_options['query'];

        $i = 0;
        while ($items = $__items->findBy($query, 10, $i)) {
            foreach ($items as $item) {

                // Try to find an existing record.
                $record = $__records->findBySql(
                    'exhibit_id=? && item_id=?',
                    array($exhibit->id, $item->id), true
                );

                // Otherwise, create one.
                if (!$record) {
                    $record = new NeatlineRecord($exhibit, $item);
                    $record->added = $item->added;
                }

                $record->save();

            }
            $i++;
        }

    }


}

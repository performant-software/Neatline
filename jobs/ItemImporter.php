<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Item import job.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Job_ItemImporter extends Omeka_Job_AbstractJob
{


    /**
     * Import Omeka items.
     */
    public function perform()
    {

        $this->_mockView();

        // Load the exhibit.
        $exhibit = $this->_db->getTable('NeatlineExhibit')->
            find($this->_options['exhibit_id']);

        // Create records.
        foreach (get_records('Item', array(), 1000) as $item) {
            $record = new NeatlineRecord($exhibit, $item);
            $record->save();
        }

    }


    /**
     * Set a mock `Omeka_View` instance in the registry.
     */
    protected function _mockView()
    {

        $view = new Omeka_View;
        Zend_Registry::set('view', $view);

        // Register default views.
        $view->setScriptPath(VIEW_SCRIPTS_DIR);

        // Register Neatline views.
        $view->addScriptPath(NL_DIR.'/views/shared');

        // Register public theme views.
        $theme = get_option('public_theme');
        $view->addScriptPath(PUBLIC_THEME_DIR.'/'.$theme.'/neatline');

    }


}

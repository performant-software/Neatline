<?php
/**
 * Development tasks.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_DevController extends Omeka_Controller_AbstractActionController
{

    /**
     * Install development exhibit.
     *
     * @return void.
     */
    public function installAction() {
        $this->_helper->viewRenderer->setNoRender(true);
        __devInstall();
        $this->_redirect('neatline');
    }

    /**
     * Uninstall development exhibit.
     *
     * @return void.
     */
    public function uninstallAction() {
        $this->_helper->viewRenderer->setNoRender(true);
        __devUninstall();
        $this->_redirect('neatline');
    }

}

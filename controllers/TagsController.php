<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tags controller. Emulates a REST API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagsController extends Neatline_RestController
{


    /**
     * Disable view rendering, set tags table.
     */
    public function init()
    {
        $this->__table = $this->_helper->db->getTable('NeatlineTag');
        $this->__exhib = $this->_helper->db->getTable('NeatlineExhibit');
        $this->exhibit = $this->__exhib->find($this->_request->id);
        parent::init();
    }


    /**
     * Get a tags collection.
     */
    public function getAction()
    {
        echo Zend_Json::encode(
            $this->__table->queryTags($this->exhibit)
        );
    }


    /**
     * Create a new tag.
     */
    public function postAction()
    {

        // Create tag.
        $tag = new NeatlineTag($this->exhibit);
        $tag->save();

        // Forward to records GET.
        $this->_forward('get', 'tag', 'neatline', array(
            'id' => $tag->id
        ));

    }


}

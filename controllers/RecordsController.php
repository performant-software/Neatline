<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsController extends Neatline_Controller_Rest
{


    /**
     * Set the default model, get tables.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineRecord');
        $this->_exhibits = $this->_helper->db->getTable('NeatlineExhibit');
        $this->_records  = $this->_helper->db->getTable('NeatlineRecord');
        parent::init();
    }


    /**
     * Get a collection of records.
     * @REST
     */
    public function listAction()
    {
        $params = $this->_request->getParams();
        foreach ($params as $key=>$val) {
            switch ($key) {
                case 'exhibit_id':
                case 'zoom':
                case 'limit':
                case 'start': 
                    $params[$key] = get_db()->quote($val, "INT");
                    break;
                case 'extent':
                    # do nothing, extent is filtered elsewhere
                    break;
                case 'order':
                    if (!in_array($val, array("id","owner_id","item_id","exhibit_id","added","modified",
                                            "is_coverage","is_wms","slug","title","item_title","body",
                                            "coverage","tags","widgets","presenter","fill_color",
                                            "fill_color_select","stroke_color","stroke_color_select",
                                            "fill_opacity","fill_opacity_select","stroke_opacity",
                                            "stroke_opacity_select","stroke_width","point_radius",
                                            "zindex","weight","start_date","end_date","after_date",
                                            "before_date","point_image","wms_address","wms_layers",
                                            "min_zoom","max_zoom","map_zoom","map_focus"))) {
                        unset($params['order']);
                    }
                    break;
                default:
                    $params[$key] = get_db()->quote($val);
                    break;
            }
        }
        $results = $this->_records->queryRecords($params);
        echo Zend_Json::encode($results);
    }


    /**
     * Get an individual record.
     * @REST
     */
    public function getAction()
    {
        echo Zend_Json::encode($this->_helper->db->findById()->toArray());
    }


    /**
     * Create a record.
     * @REST
     */
    public function postAction()
    {

        // Create record.
        $record = new NeatlineRecord();
        $post = Zend_Json::decode($this->_request->getRawBody());
        $record->saveForm($post);

        // Respond with record data.
        echo Zend_Json::encode($record->toArray());

    }


    /**
     * Update a record.
     * @REST
     */
    public function putAction()
    {

        // Find the record.
        $record = $this->_records->find($this->_request->id);

        // Decode and save PUT body.
        $record->saveForm(Zend_Json::decode(file_get_contents(
            Zend_Registry::get('fileIn')), true
        ));

        // Respond with record data.
        echo Zend_Json::encode($record->toArray());

    }


    /**
     * Delete a record.
     * @REST
     */
    public function deleteAction()
    {

        // Find and delete the record.
        $record = $this->_records->find($this->_request->id);
        $record->delete();

        // Return an empty JSON object.
        echo Zend_Json::encode(array());

    }


}

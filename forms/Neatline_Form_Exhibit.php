<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Form_Exhibit extends Omeka_Form
{


    private $exhibit;


    /**
     * Construct the exhibit add/edit form.
     */
    public function init()
    {
        parent::init();
        $this->_registerElements();
    }


    /**
     * Bind an exhibit record to the form.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     */
    public function setExhibit(NeatlineExhibit $exhibit)
    {
        $this->exhibit = $exhibit;
    }


    /**
     * Define the form elements.
     */
    private function _registerElements()
    {

        // Title:
        $this->addElement('text', 'title', array(
            'label'         => __('Title'),
            'description'   => __('A top-level heading for the exhibit, displayed in the page header in the public view for the exhibit.'),
            'value'         => $this->exhibit->title,
            'required'      => true,
            'size'          => 40,
            'validators'    => array(
                array('validator' => 'NotEmpty', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_NotEmpty::IS_EMPTY => __('Enter a title.')
                        )
                    )
                )
            )
        ));

        // Slug:
        $this->addElement('text', 'slug', array(
            'label'         => __('URL Slug'),
            'description'   => __('A unique string used to form the public-facing URL for the exhibit. Can contain letters, numbers, and hyphens.'),
            'value'         => $this->exhibit->slug,
            'required'      => true,
            'size'          => 40,
            'filters'       => array('StringTrim'),
            'validators'    => array(
                array('validator' => 'NotEmpty', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_NotEmpty::IS_EMPTY => __('Enter a slug.')
                        )
                    )
                ),
                array('validator' => 'Regex', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'pattern' => '/^[0-9a-z\-]+$/',
                        'messages' => array(
                            Zend_Validate_Regex::NOT_MATCH => __('The slug can only contain letters, numbers, and hyphens.')
                        )
                    )
                ),
                array('validator' => 'Db_NoRecordExists', 'options' =>
                    array(
                        'table'     => $this->exhibit->getTable()->getTableName(),
                        'adapter'   => $this->exhibit->getDb()->getAdapter(),
                        'field'     => 'slug',
                        'exclude'   => array('field' => 'id', 'value' => (int)$this->exhibit->id),
                        'messages'  => array(
                            'recordFound' => __('The slug is already in use.')
                        )
                    )
                )
            )
        ));

        // Narrative:
        $this->addElement('textarea', 'narrative', array(
            'label'         => __('Narrative'),
            'description'   => __('A long-format prose narrative to accompany exhibit.'),
            'value'         => $this->exhibit->narrative,
            'attribs'       => array('rows' => '10')
        ));

        // Widgets:
        $this->addElement('multiselect', 'widgets', array(
            'label'         => __('Widgets'),
            'description'   => __('Select the user-interface widgets available in the exhibit.'),
            'attribs'       => array('data-placeholder' => 'Select one or more widgets', 'class' => 'chosen'),
            'multiOptions'  => array_flip(nl_getExhibitWidgets()),
            'value'         => nl_explode($this->exhibit->widgets),
        ));

        // Available Map Layers:
        $this->addElement('multiselect', 'spatial_layers', array(
            'label'         => __('Enabled Spatial Layers'),
            'description'   => __('Choose the collection of spatial layers that should be available in the layer picker widget.'),
            'attribs'       => array('data-placeholder' => 'Select one or more layers', 'class' => 'chosen'),
            'multiOptions'  => nl_getLayersForSelect(),
            'value'         => nl_explode($this->exhibit->spatial_layers)
        ));

        // Default Map Layer:
        $this->addElement('select', 'spatial_layer', array(
            'label'         => __('Default Spatial Layer'),
            'description'   => __('Select which of the spatial layers should be visible by default when the exhibit starts.'),
            'attribs'       => array('data-placeholder' => 'Select a layer', 'class' => 'chosen'),
            'multiOptions'  => nl_getLayersForSelect(),
            'value'         => nl_explode($this->exhibit->spatial_layer),
            'required'      => true,
            'validators'    => array(
                array('validator' => 'NotEmpty', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_NotEmpty::IS_EMPTY => __('Select a layer.')
                        )
                    )
                )
            )
        ));

        // Image Layer:
        $this->addElement('text', 'image_layer', array(
            'label'         => __('Image Layer'),
            'description'   => __('To use a static image as the base layer of the exhibit, enter the web-accessible location of the image.'),
            'value'         => $this->exhibit->image_layer,
            'size'          => 40
        ));

        // Zoom Levels:
        $this->addElement('text', 'zoom_levels', array(
            'label'         => __('Zoom Levels'),
            'description'   => __('Enter the number of zoom levels available for the static image.'),
            'value'         => $this->exhibit->zoom_levels,
            'required'      => true,
            'size'          => 40,
            'validators'    => array(
                array('validator' => 'NotEmpty', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_NotEmpty::IS_EMPTY => __('Enter a zoom level count.')
                        )
                    )
                ),
                array('validator' => 'Int', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_Int::NOT_INT => __('Must be an integer.')
                        )
                    )
                )
            )
        ));

        // WMS Address:
        $this->addElement('text', 'wms_address', array(
            'label'         => __('WMS Address'),
            'description'   => __('To use a custom WMS layer as the base layer of the exhibit, enter (a) the address of the WMS server.'),
            'value'         => $this->exhibit->wms_address,
            'size'          => 40
        ));

        // WMS Layers:
        $this->addElement('text', 'wms_layers', array(
            'label'         => __('WMS Layers'),
            'description'   => __('And (b) the comma-delimited list of layers.'),
            'value'         => $this->exhibit->wms_layers,
            'size'          => 40
        ));
        
        // Zoomify Address:
        $this->addElement('text', 'zoomify_address', array(
            'label'         => __('Zoomify Address'),
            'description'   => __('To use a custom Zoomify layer as the base layer of the exhibit, enter (a) the address of the Zoomified image folder,'),
            'value'         => $this->exhibit->zoomify_address,
            'size'          => 40
        ));

        // Zoomify Width:
        $this->addElement('text', 'zoomify_width', array(
            'label'         => __('Zoomify Width'),
            'description'   => __('(b) the Width of the image as specified in the ImageProperties.xml,'),
            'value'         => $this->exhibit->zoomify_width,
            'size'          => 40
        ));

        // Zoomify Height:
        $this->addElement('text', 'zoomify_height', array(
            'label'         => __('Zoomify Height'),
            'description'   => __('and (c) the Height of the image as specified in the ImageProperties.xml.'),
            'value'         => $this->exhibit->zoomify_height,
            'size'          => 40
        ));

        // Spatial Querying:
        $this->addElement('checkbox', 'spatial_querying', array(
            'label'         => __('Spatial Querying'),
            'description'   => __('If checked, the map will continously update to display just the records that fall inside the current viewport.'),
            'value'         => $this->exhibit->spatial_querying
        ));

        // Public:
        $this->addElement('checkbox', 'public', array(
            'label'         => __('Public'),
            'description'   => __('By default, exhibits are visible only to site administrators. Check here to publish the exhibit to the public site.'),
            'value'         => $this->exhibit->public
        ));

        // Submit:
        $this->addElement('submit', 'submit', array(
            'label' => __('Save Exhibit')
        ));

        $this->addDisplayGroup(array(
            'title',
            'slug',
            'narrative',
            'widgets',
            'spatial_layers',
            'spatial_layer',
            'image_layer',
            'zoom_levels',
            'wms_address',
            'wms_layers',
            'zoomify_address',
            'zoomify_width',
            'zoomify_height',
            'spatial_querying',
            'public'
        ), 'fields');

        $this->addDisplayGroup(array(
            'submit'
        ), 'submit_button');

    }


}

<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
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
            'description'   => __('A title for the exhibit, displayed in the page header in the public view for the exhibit.'),
            'size'          => 40,
            'value'         => $this->exhibit->title,
            'required'      => true,
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
            'size'          => 40,
            'value'         => $this->exhibit->slug,
            'required'      => true,
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
            'description'   => __('Select the sub-plugin widgets available in the exhibit.'),
            'attribs'       => array('data-placeholder' => 'Select one or more widgets', 'class' => 'chosen'),
            'multiOptions'  => array_flip(nl_getExhibitWidgets()),
            'value'         => nl_explode($this->exhibit->widgets),
        ));

        // API Layers:
        $this->addElement('multiselect', 'spatial_layers', array(
            'label'         => __('Spatial Layers'),
            'description'   => __('Select which of the spatial layers should be visible by default when the exhibit starts.'),
            'attribs'       => array('data-placeholder' => 'Select one or more layers', 'class' => 'chosen'),
            'multiOptions'  => nl_getLayersForSelect(),
            'value'         => nl_explode($this->exhibit->spatial_layers)
        ));

        // Spatial Layer:
        $this->addElement('select', 'spatial_layer', array(
            'label'         => __('Default Spatial Layer'),
            'description'   => __('Select a spatial layer for the exhibit starts.'),
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
            'description'   => __('The address of a static image to use as the exhibit base layer.'),
            'size'          => 40,
            'value'         => $this->exhibit->image_layer
        ));

        // WMS Address:
        $this->addElement('text', 'wms_address', array(
            'label'         => __('WMS Server'),
            'description'   => __('The web-accessible location of a WMS server.'),
            'size'          => 40,
            'value'         => $this->exhibit->wms_address
        ));

        // WMS Layers:
        $this->addElement('text', 'wms_layers', array(
            'label'         => __('WMS Layers'),
            'description'   => __('A comma-delimited list of WMS layers.'),
            'size'          => 40,
            'value'         => $this->exhibit->wms_layers
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
            'wms_address',
            'wms_layers',
            'public'
        ), 'fields');

        $this->addDisplayGroup(array(
          'submit'
        ), 'submit_button');

    }


}

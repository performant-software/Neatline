<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Add exhibit form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ExhibitForm extends Omeka_Form
{


    private $_exhibit;


    /**
     * Construct the exhibit add/edit form.
     */
    public function init()
    {

        parent::init();

        $this->setMethod('post');
        $this->setAttrib('id', 'add-exhibit-form');
        $this->addElementPrefixPath('Neatline', dirname(__FILE__));

        // Title.
        $this->addElement('text', 'title', array(
            'label'         => __('Title'),
            'description'   => __('The title is displayed at the top of the exhibit.'),
            'size'          => 40,
            'value'         => $this->_exhibit->title,
            'required'      => true,
            'class'         => 'title',
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

        // Slug.
        $this->addElement('text', 'slug', array(
            'label'         => __('URL Slug'),
            'description'   => __('The URL slug is used to form the public URL for the exhibit. Can contain letters, numbers, and hyphens.'),
            'size'          => 40,
            'required'      => true,
            'value'         => $this->_exhibit->slug,
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
                        'table'     => $this->_exhibit->getTable()->getTableName(),
                        'adapter'   => $this->_exhibit->getDb()->getAdapter(),
                        'field'     => 'slug',
                        'exclude'   => array(
                            'field' => 'id',
                            'value' => (int)$this->_exhibit->id
                        ),
                        'messages'  =>  array(
                            'recordFound' => __('The slug is already in use.')
                        )
                    )
                )
            )
        ));

        // Description.
        $this->addElement('textarea', 'description', array(
            'label'         => __('Description'),
            'description'   => __('Supporting prose to describe the exhibit.'),
            'value'         => $this->_exhibit->description,
            'attribs'       => array('class' => 'html-editor', 'rows' => '10')
        ));

        // Public.
        $this->addElement('checkbox', 'public', array(
            'label'         => __('Public'),
            'description'   => __('By default, exhibits are only visible to you.'),
            'value'         => $this->_exhibit->public
        ));

        // Submit.
        $this->addElement('submit', 'submit', array(
            'label' => __('Save Exhibit')
        ));

        // Group the metadata fields.
        $this->addDisplayGroup(array(
            'title',
            'slug',
            'description',
            'public'
        ), 'exhibit_info');

        // Group the submit button sparately.
        $this->addDisplayGroup(array(
            'submit'
        ), 'submit_button');

    }


    /**
     * Bind an exhibit record to the form.
     */
    public function setExhibit(NeatlineExhibit $exhibit)
    {
        $this->_exhibit = $exhibit;
    }


}

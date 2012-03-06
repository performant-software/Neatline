<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Edit exhibit form.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class EditExhibitForm extends Omeka_Form
{

    private $_exhibit;

    /**
     * Set the exhibit that is being edited.
     *
     * @param NeatlineExhibit $exhibit The exhibit.
     *
     * @return void.
     */
    public function setExhibit(NeatlineExhibit $exhibit)
    {
        $this->_exhibit = $exhibit;
    }

    /**
     * Construct the exhibit add/edit form.
     *
     * @return void.
     */
    public function init()
    {

        parent::init();

        // Get database and tables.
        $_db = get_db();
        $_layers = $_db->getTable('NeatlineBaseLayer');
        $_maps = $_db->getTable('NeatlineMapsMap');
        $_exhibits = $_db->getTable('NeatlineExhibit');

        $this->setMethod('post');
        $this->setAttrib('id', 'add-exhibit-form');
        $this->addElementPrefixPath('Neatline', dirname(__FILE__));

        // Title.
        $this->addElement('text', 'title', array(
            'label'         => 'Title',
            'description'   => 'The title is displayed at the top of the exhibit.',
            'size'          => 40,
            'required'      => true,
            'validators'    => array(
                array('validator' => 'NotEmpty', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_NotEmpty::IS_EMPTY => 'Enter a title.'
                        )
                    )
                )
            )
        ));

        // Slug.
        $this->addElement('text', 'slug', array(
            'label'         => 'URL Slug',
            'description'   => 'The URL slug is used to form the public URL for the exhibit. Can only contain letters, numbers, and hyphens (no spaces).',
            'size'          => 40,
            'required'      => true,
            'validators'    => array(
                array('validator' => 'NotEmpty', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_NotEmpty::IS_EMPTY => 'Enter a slug.'
                        )
                    )
                ),
                array('validator' => 'Regex', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'pattern' => '/^[0-9a-z\-]+$/',
                        'messages' => array(
                            Zend_Validate_Regex::NOT_MATCH => 'Lowercase letters, numbers, and hyphens only.'
                        )
                    )
                )
            )
        ));

        // Public.
        $this->addElement('checkbox', 'public', array(
            'label'         => 'Public?',
            'description'   => 'By default, exhibits are only visible to you.'
        ));

        // Submit.
        $this->addElement('submit', 'submit', array(
            'label' => 'Save Exhibit'
        ));

        // Group the metadata fields.
        $this->addDisplayGroup(array(
            'title',
            'slug',
            'public'
        ), 'exhibit_info');

        // Group the submit button sparately.
        $this->addDisplayGroup(array(
            'submit'
        ), 'submit_button');

    }

    /**
     * Validate the form.
     *
     * @return void.
     */
    public function isValid($data)
    {

        // Get database and tables.
        $_db = get_db();
        $_exhibits = $_db->getTable('NeatlineExhibit');

        // Add the non-self unique validator for the slug.
        $this->getElement('slug')->addValidator(
            'Db_NoRecordExists', false, array(
                'table'     =>  $_exhibits->getTableName(),
                'field'     =>  'slug',
                'adapter'   =>  $_db->getAdapter(),
                'exclude'   =>  array(
                    'field' => 'slug',
                    'value' => (string) $this->_exhibit->slug
                ),
                'messages'  =>  array(
                    'recordFound' => 'Slug taken.'
                )
            )
        );

        return parent::isValid($data);

    }

}

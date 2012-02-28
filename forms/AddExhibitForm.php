<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Index controller integration tests.
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

class AddExhibitForm extends Omeka_form
{

    /**
     * Construct the exhibit add/edit form.
     *
     * @return void.
     */
    public function init()
    {

        // Get database and tables.
        $_db = get_db();
        $_layers = $_db->getTable('NeatlineBaseLayer');

        parent::init();
        $this->setMethod('post');

        // Title.
        $this->addElement('text', 'title', array(
            'label'         => 'Title',
            'description'   => 'The title is displayed at the top of the exhibit.',
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

        // Slug.
        $this->addElement('text', 'slug', array(
            'label'         => 'URL Slug',
            'description'   => 'The URL slug is used to form the public URL for the exhibit. Can only contain letters, numbers, and hyphens (no spaces)..',
            'size'          => 40,
            'validators'    => array(
                array('validator' => 'NotEmpty', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_NotEmpty::IS_EMPTY => __('Enter a slug.')
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

        // Map.
        $this->addElement('select', 'map', array(
            'label'         => 'Option 1: Map',
            'description'   => 'Select a Geoserver map to user as the exhibit foundation.',
            'multiOptions'   => array()
        ));

        // Image.
        $this->addElement('select', 'image', array(
            'label'         => 'Option 2: Image',
            'description'   => 'Or, select a static image to use as the exhibit foundation.',
            'multiOptions'   => array()
        ));

        // Base layer.
        $this->addElement('select', 'baselayer', array(
            'label'         => 'Default Base Layer',
            'description'   => 'Select a default base layer.',
            'multiOptions'   => $_layers->getLayersForSelect()
        ));

        // Submit.
        $this->addElement('submit', 'submit', array(
            'label' => 'Create Exhibit'
        ));

        // Group the metadata fields.
        $this->addDisplayGroup(array(
            'title',
            'slug',
            'public'
        ), 'exhibit_info');

        // Group the baselayer fields.
        $this->addDisplayGroup(array(
            'baselayer',
            'map',
            'image'
        ), 'baselayer_info');

        // Group the submit button sparately.
        $this->addDisplayGroup(array(
            'submit'
        ), 'submit_button');

    }

}

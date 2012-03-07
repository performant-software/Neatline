<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Add exhibit form.
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

class AddExhibitForm extends Omeka_Form
{

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
                ),
                array('validator' => 'Db_NoRecordExists', 'options' =>
                    array(
                        'table'     =>  $_exhibits->getTableName(),
                        'field'     =>  'slug',
                        'adapter'   =>  $_db->getAdapter(),
                        'messages'  =>  array(
                            'recordFound' => 'Slug taken.'
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
        if ($_maps && method_exists($_maps, 'getMapsForSelect')) {
            $this->addElement('select', 'map', array(
                'label'         => '(Optional): Geoserver Map',
                'description'   => 'Select a Geoserver map to use as the exhibit foundation. An exhibit can use a Geoserver map or a static image, but not both. To just use a real-geography base layers, leave both fields blank.',
                'attribs'       => array('style' => 'width: 230px'),
                'multiOptions'  => $_maps->getMapsForSelect(),
                'validators'    => array(
                    array('validator' => 'MapOrImage', 'breakChainOnFailure' => true, 'options' =>
                        array(
                            'messages' => array(
                                Neatline_Validate_MapOrImage::MAP_OR_IMAGE => 'Can\'t use both a map and an image.'
                            )
                        )
                    )
                )
            ));
        }

        // Image.
        $this->addElement('select', 'image', array(
            'label'         => '(Optional): Static Image',
            'description'   => 'Or, select a static image to use as the exhibit foundation.',
            'attribs'       => array('style' => 'width: 230px'),
            'multiOptions'  => $this->getImagesForSelect(),
            'validators'    => array(
                array('validator' => 'MapOrImage', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Neatline_Validate_MapOrImage::MAP_OR_IMAGE => 'Can\'t use both a map and an image.'
                        )
                    )
                )
            )
        ));

        // Base layer.
        $this->addElement('select', 'baselayer', array(
            'label'         => 'Default Base Layer',
            'description'   => 'Select a default base layer.',
            'attribs'       => array('style' => 'width: 230px'),
            'multiOptions'  => $_layers->getLayersForSelect()
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

    /**
     * Get the list of images for the dropdown select.
     *
     * @return array $images The images.
     */
    public function getImagesForSelect()
    {

        $files = array('none' => '-');

        // Get file table.
        $_db = get_db();
        $_files = $_db->getTable('File');

        // Build select.
        $select = $_files->getSelect()->where(
            'f.has_derivative_image = 1'
        )->order('original_filename DESC');

        // Fetch and return.
        $records = $_files->fetchObjects($select);

        // Build the array.
        foreach($records as $record) {
            $files[$record->id] = $record->original_filename;
        };

        return $files;

    }

}

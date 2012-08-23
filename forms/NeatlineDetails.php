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
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class Neatline_Form_NeatlineDetails extends Omeka_Form
{

    private $_neatline;

    /**
     * Construct the exhibit add/edit form.
     *
     * @return void.
     */
    public function init()
    {

        parent::init();

        $this->setMethod('post');
        $this->setAttrib('id', 'add-exhibit-form');
        $this->addElementPrefixPath('Neatline', dirname(__FILE__));

        // Title.
        $this->addElement('text', 'name', array(
            'label'         => __('Title'),
            'description'   => __('The title is displayed at the top of the exhibit.'),
            'size'          => 40,
            'value'         => $this->_neatline->name,
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

        // Description.
        $this->addElement('textarea', 'description', array(
            'label'         => __('Description'),
            'description'   => __('Supporting prose to describe the exhibit.'),
            'value'         => $this->_neatline->description,
            'attribs'       => array('class' => 'html-editor', 'rows' => '20')
        ));

        // Slug.
        $this->addElement('text', 'slug', array(
            'label'         => __('URL Slug'),
            'description'   => __('The URL slug is used to form the public URL for the exhibit. Can contain letters, numbers, and hyphens.'),
            'size'          => 40,
            'required'      => true,
            'value'         => $this->_neatline->slug,
            'filters'       => array('StringTrim'),
            'validators'    => array(
                array('validator' => 'NotEmpty', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'messages' => array(
                            Zend_Validate_NotEmpty::IS_EMPTY => __('The slug cannot be empty.')
                        )
                    )
                ),
                array('validator' => 'Regex', 'breakChainOnFailure' => true, 'options' =>
                    array(
                        'pattern' => '/^[0-9a-z\-]+$/',
                        'messages' => array(
                            Zend_Validate_Regex::NOT_MATCH => __('The slug can only contain lowercase letters, numbers, and hyphens.')
                        )
                    )
                ),
                array('validator' => 'Db_NoRecordExists', 'options' =>
                    array(
                        'table'     =>  $this->_neatline->getTable()->getTableName(),
                        'field'     =>  'slug',
                        'adapter'   =>  $this->_neatline->getDb()->getAdapter(),
                        'exclude'   => array(
                            'field' => 'id',
                            'value' => (int)$this->_neatline->id
                        ),
                        'messages'  =>  array(
                            'recordFound' => __('The slug is already in use.')
                        )
                    )
                )
            )
        ));

        // Public.
        $this->addElement('checkbox', 'public', array(
            'label'         => __('Public'),
            'description'   => __('By default, exhibits are only visible to you.'),
            'value'         => $this->_neatline->public
        ));

        // Image.
        $this->addElement('select', 'image_id', array(
            'label'         => __('(Optional): Static Image'),
            'description'   => __('Select a file to build the exhibit on a static image.'),
            'attribs'       => array('style' => 'width: 230px'),
            'multiOptions'  => $this->getImagesForSelect(),
            'value'         => $this->_neatline->image_id,
        ));

        // Submit.
        $this->addElement('submit', 'submit', array(
            'label' => __('Save Neatline')
        ));

        // Group the metadata fields.
        $this->addDisplayGroup(array(
            'name',
            'description',
            'slug',
            'image_id',
            'public'
        ), 'exhibit_info');

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

    public function setNeatline(NeatlineExhibit $neatline)
    {
        $this->_neatline = $neatline;
    }
}

<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Define a three-tiered ACL:
 *
 *  - Supers and Admins can do everything.
 *
 *  - Contributors can add/update/delete their own exhibits and records, but
 *  not exhibits or records that belong to other users.
 *
 *  - Researchers can't access any Neatline content.
 *
 * @param Zend_Acl $acl
 */
function nl_defineAcl($acl)
{


    // Exhibits resource.
    if (!$acl->has('Neatline_Exhibits')) {
        $acl->addResource('Neatline_Exhibits');
    }

    // Records resource.
    if (!$acl->has('Neatline_Records')) {
        $acl->addResource('Neatline_Records');
    }


    // Anonymous:
    // ------------------------------------------------------------------------

    // Anyone can view items.
    $acl->allow(null, 'Items', array('get'));

    // Anyone can view exhibits.
    $acl->allow(null, 'Neatline_Exhibits', array(
        'index',
        'show',
        'fullscreen',
        'browse',
        'get'
    ));

    // Anyone can view records.
    $acl->allow(null, 'Neatline_Records', array(
        'index',
        'list',
        'get'
    ));


    // Contributor:
    // ------------------------------------------------------------------------

    // Contributors can add and delete-confirm exhibits.
    $acl->allow('contributor', 'Neatline_Exhibits', array(
        'add',
        'delete-confirm'
    ));

    // Contributors can edit their own exhibits.
    $acl->allow('contributor', 'Neatline_Exhibits', array(
        'showNotPublic',
        'editSelf',
        'editorSelf',
        'putSelf',
        'importSelf',
        'deleteSelf',
        'duplicateAll'
    ));
    $acl->allow('contributor', 'Neatline_Exhibits', array(
        'edit',
        'editor',
        'put',
        'import',
        'delete',
        'duplicate'
    ), new Omeka_Acl_Assert_Ownership);

    // Contributors can create their own records.
    $acl->allow('contributor', 'Neatline_Records', 'post');

    // Contributors can edit/elete their own records.
    $acl->allow('contributor', 'Neatline_Records', array(
        'putSelf',
        'deleteSelf'
    ));
    $acl->allow('contributor', 'Neatline_Records', array(
        'put',
        'delete'
    ), new Neatline_Acl_Assert_RecordOwnership);


    // Super and Admin:
    // ------------------------------------------------------------------------

    // Supers and admins can do everything.
    $acl->allow(array('super', 'admin'), 'Neatline_Exhibits');
    $acl->allow(array('super', 'admin'), 'Neatline_Records');


}
